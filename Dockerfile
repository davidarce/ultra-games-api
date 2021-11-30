# build environment
FROM node:14 as build
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build

FROM node:14-slim
ENV NODE_ENV production

COPY --from=build /app/dist /app/dist/
COPY --from=build ["app/package.json", "app/package-lock.json*", "/app/"]
RUN npm install --prefix /app --production
WORKDIR /app

CMD npm run start:prod
