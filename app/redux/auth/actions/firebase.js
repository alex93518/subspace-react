import { call } from 'redux-saga/effects';
import { firebaseAuth } from 'utils/firebase';
import { getGithubUserInfo } from 'utils/github';
import { path } from 'ramda'
import CurrentRelay, {
  AddUserProviderMutation, CreateUserMutation,
} from 'relay';
import { getUserName, getUserProvider } from './userFetch'

export function* createUserWithEmailPassword({ payload }) {
  const { userName, email, password } = payload
  const user = yield call(
    [firebaseAuth, firebaseAuth.createUserWithEmailAndPassword],
    email,
    password
  )

  yield call(CurrentRelay.Store.commitUpdate, new CreateUserMutation({
    userName,
    firebaseId: user.uid,
    emailAddress: email,
    password,
    provider: 'firebase-email',
  }));

  yield call(CurrentRelay.reset)
  return { user, userName }
}

export function* signIn({ payload: { authProvider, getNameAndCreateUser } }) {
  const usedEmail = localStorage.getItem('providerAuthEmail')
  if (usedEmail) {
    authProvider.setCustomParameters({
      login_hint: usedEmail,
    })
  }

  const { user } = yield call(
    [firebaseAuth, firebaseAuth.signInWithPopup],
    authProvider
  )

  if (user) {
    yield call(CurrentRelay.reset, null, 'firebase', user._lat) // eslint-disable-line
    const providerId = user.providerData[0].uid
    const firebaseId = user.uid
    const provider = `firebase-${user.providerData[0].providerId}`
    let fullName = user.displayName
    let photoUrl = user.photoURL
    let emailAddress = user.email

    const { userProvider } = yield call(
      getUserProvider, providerId, provider, firebaseId
    )

    if (!userProvider) {
      if (user.providerData[0].providerId === 'github.com') {
        let githubInfo = yield call(getGithubUserInfo, providerId)
        githubInfo = yield githubInfo.json()

        photoUrl = githubInfo.avatar_url
        fullName = githubInfo.login
        emailAddress = githubInfo.email
      }

      const userPayload = {
        userName,
        fullName,
        photoUrl,
        emailAddress,
        provider,
        providerId,
        firebaseId,
        displayName: fullName,
      }
      try {
        const userName = yield call(getNameAndCreateUser, userPayload)
        localStorage.setItem('providerAuthEmail', userName)
        return { user: userPayload, userName }
      } catch (ex) {
        throw new Error({ message: 'Cannot login' })
      }
    }

    const userInfo = yield call(getUserName, userProvider.userId)
    const userName = path(['user', 'userName'], userInfo)
    if (userName) {
      const userRet = {
        ...userInfo.user,
        displayName: userInfo.user.fullName,
      }
      return { user: userRet, userName }
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

  const { userProvider } = yield call(
    getUserProvider, null, 'firebase-email', user.uid
  )

  if (userProvider) {
    const userInfo = yield call(getUserName, userProvider.userId)
    const userName = path(['user', 'userName'], userInfo)

    if (userName) {
      yield call(CurrentRelay.reset)
      return { user, userName }
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

    yield call(CurrentRelay.Store.commitUpdate, new AddUserProviderMutation({
      id,
      userId,
      userName,
      provider,
      providerId,
      firebaseId,
    }));

    if (callback) callback(providerId)
    return true;
  }

  throw new Error({ message: 'Cannot login to provider' })
}
