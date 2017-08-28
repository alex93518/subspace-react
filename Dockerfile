FROM node:latest

ARG GRAPHQL_ENDPOINT

# Create folder
RUN mkdir -p /app /home/dev \
    && groupadd -r dev \
    && useradd -r -g dev -d /home/dev -s /sbin/nologin dev \
    && chown -R dev:dev /home/dev \
    && npm cache clean && yarn cache clean

ENV APP=/app

# Install dependencies
COPY package.json yarn.lock /tmp/
COPY internals /tmp/internals
RUN cd /tmp && \
    yarn && \
    cd $APP && \
    ln -s /tmp/node_modules

# Copy app
COPY . $APP
RUN chown -R dev:dev $APP && chgrp -R dev $APP && chown -R dev /usr/local

WORKDIR $APP
USER dev
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start:docker"]
