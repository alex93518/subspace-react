import { call } from 'redux-saga/effects';
import { firebaseAuth } from 'utils/firebase';
import { getGithubUserInfo } from 'utils/github';
import { path } from 'ramda'
import { resetEnv, addUserPresence } from 'relay/RelayEnvironment';
import { createUserMutation, addUserProviderMutation } from 'relay';
import { getUser } from './userFetch';
import { getUserProvider } from './userProviderFetch';

export function* createUserWithEmailPassword({ payload }) {
  const { userName, email, password } = payload
  const user = yield call(
    [firebaseAuth, firebaseAuth.createUserWithEmailAndPassword],
    email,
    password
  );

  const provider = 'firebase-email';
  const userPayload = fireBaseUserToPayload(user, provider);
  const firebaseId = userPayload.firebaseId
  yield call(resetEnv, 'firebase', userPayload.token);

  yield call(createUserMutation, {
    userName,
    userId: user.uid,
    emailAddress: email,
    password,
    provider,
    firebaseId,
  });

  return { user: userPayload, userName, isInvisible: false };
}

export function* signIn({ payload: { authProvider, sendCreateUser } }) {
  const { user } = yield call(
    [firebaseAuth, firebaseAuth.signInWithPopup],
    authProvider
  )

  if (user) {
    const { data: { viewer: { userProvider } } } = yield call(
      getUserProvider, user.uid
    )

    const provider = `firebase-${user.providerData[0].providerId}`
    const userPayload = fireBaseUserToPayload(
      user, provider, userProvider ? userProvider.userName : null
    );
    const firebaseId = userPayload.firebaseId;

    yield call(resetEnv, 'firebase', userPayload.token);

    if (!userProvider) {
      let photoUrl = userPayload.photoUrl;
      let fullName = userPayload.fullName;
      let emailAddress = userPayload.emailAddress;

      if (user.providerData[0].providerId === 'github.com') {
        let githubInfo = yield call(getGithubUserInfo, userPayload.providerId)
        githubInfo = yield githubInfo.json()

        photoUrl = githubInfo.avatar_url
        fullName = githubInfo.login
        emailAddress = githubInfo.email
      }

      const retUserPayload = {
        fullName,
        photoUrl,
        emailAddress,
        provider,
        providerId: userPayload.providerId,
        firebaseId,
        token: userPayload.token,
        displayName: userPayload.displayName,
      };

      try {
        const { data: { createUser: { user: { userName, isInvisible } } } } = yield call(
          sendCreateUser, userPayload
        )
        if (!isInvisible) {
          yield call(addUserPresence, userName)
        }
        return { user: retUserPayload, userName, isInvisible };
      } catch (ex) {
        throw new Error({ message: 'Cannot login' })
      }
    }

    const { data: { viewer } } = yield call(getUser, firebaseId)
    if (viewer.user) {
      const { userName, isInvisible } = viewer.user
      if (!isInvisible) {
        yield call(addUserPresence, userName)
      }
      return { user: userPayload, userName, isInvisible };
    }

    throw new Error({ message: 'Cannot login' })
  }

  throw new Error({ message: 'No user' })
}

export function* signInWithEmailPassword({ payload: { email, password } }) {
  const user = yield call(
    [firebaseAuth, firebaseAuth.signInWithEmailAndPassword],
    email,
    password
  );

  const provider = 'firebase-email';
  const userPayload = fireBaseUserToPayload(user, provider);
  const firebaseId = userPayload.firebaseId;

  const { data: { viewer: { userProvider } } } = yield call(
    getUserProvider, user.uid
  );

  if (userProvider) {
    const userInfo = yield call(getUser, firebaseId)
    const userName = path(['user', 'userName'], userInfo.data.viewer);
    const isInvisible = path(['user', 'isInvisible'], userInfo.data.viewer);

    if (userName) {
      yield call(resetEnv, 'firebase', userPayload.token);
      if (!isInvisible) {
        yield call(addUserPresence, userName)
      }
      return { user: userPayload, userName, isInvisible };
    }
  }

  throw new Error({ message: 'No username' })
}

export function* addFirebaseProvider({
  payload: { id, userId, authProvider, callback },
}) {
  const { user } = yield call(
    [firebaseAuth, firebaseAuth.signInWithPopup],
    authProvider
  )

  if (user) {
    const providerId = user.providerData[0].uid
    const provider = `firebase-${user.providerData[0].providerId}`

    let userName = user.displayName
    if (provider === 'firebase-github.com') {
      let githubInfo = yield call(getGithubUserInfo, providerId)
      githubInfo = yield githubInfo.json()

      userName = githubInfo.login
    }

    yield call(addUserProviderMutation, {
      id,
      userId,
      userName,
      provider,
      providerId,
      firebaseId: user.uid,
    });

    if (callback) callback(providerId)
    return true;
  }

  throw new Error({ message: 'Cannot login to provider' })
}

const fireBaseUserToPayload = (user, provider, name = null) => {
  const token = user._lat // eslint-disable-line
  const providerId = user.providerData[0].uid;
  const firebaseId = user.uid;
  const fullName = name || user.displayName;
  const photoUrl = user.photoURL;
  const emailAddress = user.email;

  return {
    fullName,
    photoUrl,
    emailAddress,
    provider,
    providerId,
    firebaseId,
    token,
    displayName: fullName,
  };
};
