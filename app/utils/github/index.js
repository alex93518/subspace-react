export const getGithubUserInfo = userId => {
  const apiUrl = `https://api.github.com/user/${userId}`
  return fetch(apiUrl)
}
