# pk-ukraina

## sequelize-server-client (KISS)
 
## next-prisma-app (більш об'ємна реалізація, що включає авторизацію, серверний рендеринг і т.п.)
*Наприклад, якщо рішення треба масштабувати в щось більше, ніж Відомості про рух носія, тобто додати відомості різного плану*
за замовчуванням там зараз використовується **sqlite** але в .env ви можете додати базу даних, яка вам більше подобається:

*Наприклад*

- DATABASE_URL="file:./dev.db"

To

- DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"