## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

**Main**

Створюємо новий Next.js-проект із підтримкою TS за допомогою Create Next App:

~~~
npm create next-app next-prisma-app --ts
~~~

Встановлюємо мінімальний набір npm-пакетів, необхідних для роботи нашої програми:

#### виробничі залежності

~~~
npm install @emotion/cache @emotion/react @emotion/server @emotion/styled @formkit/auto-animate @mui/icons-material @mui/joy @mui/material @prisma/client @welldone-software/why-did-you-render argon2 cookie jsonwebtoken multer next-connect react-error-boundary react-toastify swiper swr
~~~

#### залежності для розробки

~~~
npm install -D @types/cookie @types/jsonwebtoken @types/multer babel-plugin-import prisma sass
~~~

+ @mui/... - компоненти та іконки Material UI;
+ @emotion/... - рішення CSS-в-JS, яке використовується для стилізації компонентів Material UI;
+ **prisma - ORM для роботи з реляційними БД PostgreSQL, MySQL, SQLite та SQL Server, а також з NoSQL-БД MongoDB і CockroachDB**;
+ **@prisma/client - кліент Prisma**;
+ @welldone-software/why-did-you-render - корисна утиліта для налагодження React-додатків, що дозволяє визначити причину повторного рендерингу компонента;
+ argon2 - утиліта для хешування та перевірки паролів;
+ cookie - утиліта для роботи з кукі;
+ jsonwebtoken - утиліта до роботи з токенами;
+ multer - посередник (middleware) Node.js для обробки multipart/form-data (для роботи з файлами, що містяться в запиті);
+ next-connect - бібліотека, що дозволяє працювати з інтерфейсом роутів Next.js як з роутами Express;
+ react-error-boundary - компонент-запобіжник для React-додатків;
+ react-toastify - компонент та утиліта для реалізації повідомлень у React-додатках;
+ *swiper - просунутий компонент слайдера - є одна ідея, але, можливо, я від неї відмовлюся*;
+ swr - хуки React для запиту (отримання - fetching) даних від сервера, що дозволяють обійтися без інструменту управління станом (state manager);
+ @types/... - відсутні типи TS;
+ babel-plugin-import - плагін Babel для ефективної "трясіння дерева" (tree shaking) при імпорті компонентів MUI за назвою;
+ sass - препроцесор CSS.

### Підготовка БД та налаштування ORM

Для зберігання даних користувачів та відомостій нам потрібна БД. Для простоти будемо використовувати SQLite – у цій БД дані зберігаються у вигляді файлу на сервері. Для роботи з SQLite використовуватиметься Prisma. Пізніше ще підкинемо декілько БД, та запустимо все це у докері. Взагалі по БД буде ще окрема фіча та опис. 

*Раджу встановити це [розширення](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) для VSCode для роботи зі схемою Prisma*

#### Инициализируем Prisma, находясь в корневой директории проекта:

~~~
npx prisma init
~~~

Виконання цієї команди призводить до генерації директорії prisma і файлу .env. Редагуємо файл schema.prisma в директорії prisma, визначаючи провайдер для БД в блоці datasource і моделі користувача, поста та лайка. Тобто создаем модели в /schema.prisma.

Редагуємо файл .env, визначаючи в ньому шлях до файлу БД:

~~~
DATABASE_URL="file:./dev.db"
~~~

#### Створюємо та застосовуємо міграцію до БД:

~~~
npx prisma migrate dev --name init
~~~

Виконання цієї команди призводить до генерації директорії migrations з міграцією на SQL.

Зверніть увагу: при першому виконанні migrate dev автоматично встановлюється та генерується клієнт Prisma. Надалі за будь-якої зміни схеми Prisma необхідно вручну виконувати команду 

~~~ 
npx prisma generate 
~~~ 

для оновлення клієнта.

Також зверніть увагу, що для швидкого відновлення вихідного стану БД зі втратою всіх даних можна видалити файл dev.db і виконати команду 

~~~
npx prisma db push
~~~

Залишилося налаштувати клієнта Prisma. Створюємо файл src/utils/prisma.ts наступного змісту:

~~~
import { PrismaClient } from '@prisma/client'
declare let global: { prisma: PrismaClient }

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
~~~

Цей сніпет забезпечує існування тільки одного екземпляра (синглтона - singleton) клієнта Prisma при роботі як у виробничому середовищі, так і в середовищі для розробки. Справа в тому, що в режимі розробки через HMR при перезавантаженні модуля, що імпортує prisma, буде створюватися новий екземпляр клієнта.

...