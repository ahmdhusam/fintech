FROM node:21.0.0 as Builder

WORKDIR /app

COPY package*.json yarn* ./

RUN yarn

COPY . .

RUN yarn prisma:generate

RUN yarn test

RUN yarn build

FROM node:21.0.0 as Production

WORKDIR /app

ENV NODE_ENV=production

USER node

COPY package*.json yarn* ./

RUN yarn --prod

COPY --from=Builder /app/dist ./dist

EXPOSE 3000

CMD [ "yarn", "start:prod" ]