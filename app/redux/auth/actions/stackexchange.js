import { call } from 'redux-saga/effects';
import moment from 'moment';
import { addUserProviderMutation } from 'relay';
import { firebaseAuth } from 'utils/firebase';
import { stackexchange, stackexchangeConfig } from 'utils/stackexchange';
import { resetEnv, addUserPresence } from 'relay/RelayEnvironment';
import { getUser } from './userFetch';
import { getUserProvider } from './userProviderFetch';

const init = () => (
  new Promise(resolve => {
    stackexchange.init({
      ...stackexchangeConfig,
      channelUrl: process.env.CLIENT_HOST ?
        `${process.env.CLIENT_HOST}/blank.html` :
        'http://localhost/blank.html',
      complete: resolve,
    })
  })
)

const auth = () => (
  new Promise(resolve => {
    stackexchange.authenticate({
      networkUsers: true,
      success: resolve,
    })
  })
)

export function* signInWithStackexchangeFn({
  payload: { sendCreateUser },
}) {
  let providerId = '';
  let accessToken = '';
  let displayName = '';
  let photoUrl = '';
  let expirationDate = '';

  // const seProviderId = localStorage.getItem('seProviderId')
  // const seExpire = localStorage.getItem('seExpire')

  yield call(init)
  const seAuth = yield call(auth)
  if (seAuth && seAuth.networkUsers.length > 0) {
    const userData = seAuth.networkUsers[0]
    const { user_id, display_name, profile_image } = userData
    providerId = String(user_id) // eslint-disable-line
    accessToken = seAuth.accessToken
    displayName = display_name // eslint-disable-line
    photoUrl = profile_image // eslint-disable-line
    expirationDate = seAuth.expirationDate
  }

  yield call(
    resetEnv, 'stackexchange',
    JSON.stringify({ token: accessToken, providerId }),
  )

  const firebaseId = `se-${providerId}`

  const { data: { viewer: { userProvider } } } = yield call(
    getUserProvider, firebaseId
  )

  const userPayload = {
    displayName,
    fullName: displayName,
    photoUrl,
    email: null,
    accessToken,
    provider: 'stackexchange',
    providerId,
    firebaseId,
  }

  // User exists
  if (userProvider) {
    const userInfo = yield call(getUser, firebaseId)
    const { data: { viewer: { user, firebaseToken, isInvisible } } } = userInfo
    if (user) {
      if (firebaseToken) {
        yield call(
          [firebaseAuth, firebaseAuth.signInWithCustomToken],
          firebaseToken
        );
      }
      if (!isInvisible) {
        yield call(addUserPresence, user.userName)
      }
      return { user: userPayload, userName: user.userName, isInvisible }
    }
  }

  // User not exists, create one.
  try {
    const { data: { createUser, createUser: { user: { userName, isInvisible } } } } = yield call(
      sendCreateUser, userPayload
    )
    if (createUser.firebaseToken) {
      yield call(
        [firebaseAuth, firebaseAuth.signInWithCustomToken],
        createUser.firebaseToken
      );
    }

    const expire = moment(expirationDate).unix()
    localStorage.setItem('seProviderId', providerId)
    localStorage.setItem('seAccessToken', accessToken)
    localStorage.setItem('seExpire', expire)

    if (!isInvisible) {
      yield call(addUserPresence, userName)
    }
    return { user: userPayload, userName, isInvisible }
  } catch (ex) {
    localStorage.removeItem('seProviderId')
    localStorage.removeItem('seAccessToken')
    localStorage.removeItem('seExpire')
    throw new Error({ message: 'No username' })
  }
}

export function* addStackexchangeProviderFn({
  payload: { id, userId, callback },
}) {
  yield call(init)
  const seAuth = yield call(auth)
  if (seAuth && seAuth.networkUsers.length > 0) {
    const provider = 'stackexchange';
    const providerId = String(seAuth.networkUsers[0].user_id)
    const userName = String(seAuth.networkUsers[0].display_name)
    const accessToken = seAuth.accessToken
    yield call(addUserProviderMutation, {
      id,
      userId,
      userName,
      provider,
      providerId,
      accessToken,
      firebaseId: `se-${providerId}`,
    });

    if (callback) callback(providerId)
    return true;
  }

  throw new Error({ message: 'Cannot login to provider' })
}
