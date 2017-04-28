## Terrella Client

### Development

```
yarn
yarn start
```

### Docker

##### Production

- Add hosts from `.env` to your local `/etc/hosts`
- Start docker-compose with `yarn run docker:prod -- up`

##### Production

- Add hosts from `.env` to your local `/etc/hosts`
- Build local `terrella-git` image from [terrella-git repo](https://github.com/terrella-io/terrella-git/)
- Build local `terrella-api` image from [terrella-api repo](https://github.com/terrella-io/terrella-api/)
- Start docker-compose with `yarn run docker:dev -- up`
