import CurrentRelay, { userProviderQuery, userNameQuery } from 'relay';

export const getUserName = userId => CurrentRelay.fetch({
  query: userNameQuery(userId),
})

export const getUserProvider = (
  providerId, provider, firebaseId
) => CurrentRelay.fetch({
  query: userProviderQuery(providerId, provider, firebaseId),
})
