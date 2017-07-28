import { call } from 'redux-saga/effects';
import { firebaseAuth } from 'utils/firebase';
import { getGithubUserInfo } from 'utils/github';
import { path } from 'ramda'
import { resetEnv } from 'relay/RelayEnvironment';
import { createUserMutation, addUserProviderMutation } from 'relay';
import { getUserName } from './userFetch';
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
  yield call(resetEnv, 'firebase', userPayload.token);

  yield call(createUserMutation, {
    userName,
    firebaseId: user.uid,
    emailAddress: email,
    password,
    provider,
  });

  return { user: userPayload, userName };
}

export function* signIn({ payload: { authProvider, getNameAndCreateUser } }) {
  const { user } = yield call(
    [firebaseAuth, firebaseAuth.signInWithPopup],
    authProvider
  )

  if (user) {
    const provider = `firebase-${user.providerData[0].providerId}`
    const userPayload = fireBaseUserToPayload(user, provider);

    yield call(resetEnv, 'firebase', userPayload.token);
    const { data: { viewer: { userProvider } } } = yield call(
      getUserProvider, userPayload.providerId, provider, userPayload.firebaseId
    )

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
        firebaseId: userPayload.firebaseId,
        token: userPayload.token,
        displayName: userPayload.displayName,
      };
      try {
        const userName = yield call(getNameAndCreateUser, userPayload)
        localStorage.setItem('providerAuthEmail', userName)
        return { user: retUserPayload, userName };
      } catch (ex) {
        throw new Error({ message: 'Cannot login' })
      }
    }

    const userInfo = yield call(getUserName, userProvider.userId)
    const userName = path(['user', 'userName'], userInfo.data.viewer);
    if (userName) {
      return { user: userPayload, userName };
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

  const { data: { viewer: { userProvider } } } = yield call(
    getUserProvider, null, provider, user.uid
  );

  if (userProvider) {
    const userInfo = yield call(getUserName, userProvider.userId)
    const userName = path(['user', 'userName'], userInfo.data.viewer);

    if (userName) {
      yield call(resetEnv, 'firebase', userPayload.token);
      return { user: userPayload, userName };
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
    const firebaseId = user.uid

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
      firebaseId,
    });

    if (callback) callback(providerId)
    return true;
  }

  throw new Error({ message: 'Cannot login to provider' })
}

const fireBaseUserToPayload = (user, provider) => {
  const token = user._lat // eslint-disable-line
  const providerId = user.providerData[0].uid;
  const firebaseId = user.uid;
  const fullName = user.displayName;
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
