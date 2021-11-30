## 👋 Ultra Games API

## 📚 Description

Ultra Games API is a RESTful API for managing Ultra Games information.

## 🔨 Installation

```bash
$ git clone git@github.com:davidarce/ultra-games-api.git

$ cd ultra-games-api

$ npm install
```

## 🔛 Running the app

### Locally

```bash
# development
$ npm run start

# 🔥 Hot reloading
$ npm run start:dev

# production mode
$ npm run start:prod
```

### With Docker ⛴

```bash
# build project
$ npm run build

# run with docker compose
$ docker compose up -d

# down app
$ docker compose down
```

##  Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# 🔛 Endpoints
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/030ed8d0fa753248dca4?action=collection%2Fimport)

```
Create Game:

- POST   /api/games

Sync Games:

- POST   /api/games/sync

Get all games:

- GET    /api/games 

Get game by id:

- GET    /api/games/:id

Get game publisher by id:

- GET    /api/games/:id/publisher

Update game by id:

- PATCH  /api/games/:id

Delete game by id:

- DELETE /api/games/:id

healthcheck

- GET /api/health

Swagger documentation

- GET /api/documentation

```

## 🧾 Documentation

Open swagger documentation:

[Ultra Games API documentation][1]

[1]: http://localhost:300/api/documentation
