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
# development
$ npm run build

# 🔥 Hot reloading
$ docker compose up -d
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

[![Run in Postman](https://run.pstmn.io/button.svg)]()

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

```

## Documentation

Open swagger documentation:

[![Ultra Games API documentation](https://swagger.io/img/logo-og.png)](http://localhost:300/api/documentation)
