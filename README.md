## Subspace Client

### Development

```
yarn
yarn start
```

### Docker

##### Production

- Add hosts from `.env` to your local `/etc/hosts`
- Start docker-compose with `yarn run docker:prod -- up`

##### Development

- Add hosts from `.env` to your local `/etc/hosts`
- Build local `subspace-git` image from [subspace-git repo](https://github.com/subspace-net/subspace-git/)
- Build local `subspace-api` image from [subspace-api repo](https://github.com/subspace-net/subspace-api/)
- Start docker-compose with `yarn run docker:dev -- up`
