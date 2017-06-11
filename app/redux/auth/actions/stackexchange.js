import { call } from 'redux-saga/effects';
import moment from 'moment';
import { path } from 'ramda'
import CurrentRelay, { AddUserProviderMutation } from 'relay';
import { stackexchange, stackexchangeConfig } from 'utils/stackexchange';
import { getUserName, getUserProvider } from './userFetch'

export function* signInWithStackexchangeFn({
  payload: { getNameAndCreateUser },
}) {
  let providerId = ''
  let accessToken = ''
  let displayName = ''
  let photoUrl = ''
  let expirationDate = ''

  // const seProviderId = localStorage.getItem('seProviderId')
  // const seExpire = localStorage.getItem('seExpire')

  const init = () => (
    new Promise(resolve => {
      stackexchange.init({
        ...stackexchangeConfig,
        channelUrl: 'http://localhost/blank.html',
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
    CurrentRelay.reset, null, 'stackexchange',
    JSON.stringify({ token: accessToken, providerId }),
  )
  const userProvider = yield call(
    getUserProvider, providerId, 'stackexchange', null
  )

  // User exists
  if (userProvider) {
    const userInfo = yield call(getUserName, userProvider.userId)
    const userName = path(['user', 'userName'], userInfo)
    if (userInfo && userName) {
      const user = {
        displayName: path(['user', 'fullName'], userInfo),
        fullName: path(['user', 'fullName'], userInfo),
        photoUrl: path(['user', 'photoUrl'], userInfo),
        email: null,
        accessToken,
        provider: 'stackexchange',
        providerId,
      }
      return { user, userName }
    }
  }

  // User not exists, create one.
  try {
    const user = {
      displayName,
      fullName: displayName,
      photoUrl,
      email: null,
      accessToken,
      provider: 'stackexchange',
      providerId,
    }

    const userName = yield call(getNameAndCreateUser, user, 'stackexchange')
    const expire = moment(expirationDate).unix()
    localStorage.setItem('seProviderId', providerId)
    localStorage.setItem('seAccessToken', accessToken)
    localStorage.setItem('seExpire', expire)

    return { user, userName }
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
  const init = () => (
    new Promise(resolve => {
      stackexchange.init({
        ...stackexchangeConfig,
        channelUrl: 'http://localhost/blank.html',
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

  yield call(init)
  const seAuth = yield call(auth)
  if (seAuth && seAuth.networkUsers.length > 0) {
    const provider = 'stackexchange';
    const providerId = String(seAuth.networkUsers[0].user_id)
    const userName = String(seAuth.networkUsers[0].display_name)
    const accessToken = seAuth.accessToken
    yield call(CurrentRelay.Store.commitUpdate, new AddUserProviderMutation({
      id,
      userId,
      userName,
      provider,
      providerId,
      accessToken,
    }));

    if (callback) callback(providerId)
    return true;
  }

  throw new Error({ message: 'Cannot login to provider' })
}
