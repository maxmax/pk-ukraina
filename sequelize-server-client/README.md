# sequelize-server-client (KISS)

## server

NodeJs, sequelize, mysql

pk-ukraina/sequelize-server-client/server/app/config/db.config.js
*Підключіть базу даних [mysql] або яка вам більше подобається*
*Sequelize – це ORM для роботи з такими реляційними базами даних як Postgres, MySQL, MariaDB, SQLite та MSSQL.*

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
*Cтворимо два docker-compose один для БД, другий для сервер і клієнт, щоб не мати прив'язки до БД очікування її готовності до міграцій і так далі*

## docker-compose-mysql.yml

```bash
docker-compose -f docker-compose-mysql.yml up
```

## docker-compose-server.yml

```bash
docker-compose -f docker-compose-server.yml up
```

## docker-compose.yml with client + server + mysql

*Запустіть команду docker-compose up, щоб запустити всі сервіси, описані у файлі. Додайте опцію -d, якщо ви бажаєте запустити контейнери у фоновому режимі:*

*Але в цього варіанта є свій недолік, тому що треба або перезапустити "pk-client" вручну так як БД може бути ще не готове, або дописати docker-compose таким чином, щоб pk-client стартував вже після того, як БД готова до використання та виконав усі потрібні нам міграції, можна було додати додаткові скрипти очікування, перевірки готовності, але це все такий собі процес! За певних умов я б так і зробив, але розумніший варіант використовувати два окремих контейнери, описаних вище.*

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

**Коли ви використовуєте docker-compose up --build, міграції будуть доступні у контейнері. (при розгортанні ми використовуємо міграції)!**

```bash
docker-compose up --build
```

### Technical task

![Technical task](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/tz.png)

### Endpoints

![Technical task](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/postman.png)



### Get Table

![Get Table](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/get.png)

### Get Table + pagination on client only

![Get Table](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/get-pagination.png)

### Create row

![Create row](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/create.png)

### Update/Delete row

![Update/Delete row](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/update-delete.png)

### Workbench

![Workbench](https://github.com/maxmax/pk-ukraina/raw/main/sequelize-server-client/docs/workbench.png)
