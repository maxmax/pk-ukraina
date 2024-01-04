# sequelize-server-client (KISS)

## server

NodeJs, sequelize, mysql

pk-ukraina/sequelize-server-client/server/app/config/db.config.js
*Connect the database [mysql] or any other you prefer.*
*Sequelize is an ORM for working with relational databases such as Postgres, MySQL, MariaDB, SQLite, and MSSQL.*

```bash
npm install
npm start
npm run start:prod
npm run dev
```

## client

React, Material UI, Vite.js, TypeScript

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Docker client only

```bash
docker build . -t "pk-client:v1.0"  
docker run -p 5173:5173 pk-client:v1.0
```

## Docker server only

```bash
docker build -t pk-server .
docker run -p 8080:8080 pk-server
```

## docker-compose
*Let's create two docker-compose files: one for the database and another one for the server and client, so we won't have a dependency on the database, waiting for its readiness for migrations, etc.*

## docker-compose-mysql.yml

```bash
docker-compose -f docker-compose-mysql.yml up
```

## docker-compose-server.yml

```bash
docker-compose -f docker-compose-server.yml up
```

## docker-compose.yml with client + server + mysql

*Run the command docker-compose up to start all the services described in the file. Add the -d option if you want to run the containers in the background.*

*However, this approach has its drawback because you either need to restart "pk-client" manually since the database may not be ready, or modify the docker-compose file so that pk-client starts only after the database is ready for use and has executed all the necessary migrations. Additional scripts for waiting and readiness checks can be added, but it is a somewhat cumbersome process! Under certain conditions, I would do it this way, but a smarter option is to use two separate containers as described above.*

```bash
docker-compose build
```

```bash
docker-compose up
```

Або

```bash
docker-compose up -d
```

**When you use docker-compose up --build, migrations will be available in the container. (We use migrations during deployment)!**

```bash
docker-compose up --build
```

## docker-compose-postgres.yml

```bash
docker-compose -f docker-compose-postgres.yml up
```

*reconfigure with .env.production.postgres on production*

```bash
docker-compose -f docker-compose-server-pg.yml up
```

### Technical task

![Technical task](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/tz.png)

### Endpoints

![Technical task](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/postman.png)

### Get Table

![Get Table](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/get.png)

### Get Table + pagination (on server side)

![Get Table](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/get-pagination.png)

### Create row

![Create row](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/create.png)

### Update/Delete row

![Update/Delete row](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/update-delete.png)

### Workbench

![Workbench](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/workbench.png)
