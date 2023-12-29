# pk-ukraina

## sequelize-server-client (KISS)

Generally, [this](https://github.com/maxmax/pk-ukraina/tree/main/sequelize-server-client) version is more refactored and covered by tests (so as not to waste extra time), and the whole process of creation can be more visually reviewed through individual pull requests. I did not delete the created branches when creating a pull request, so if there is time, you can see how each part was implemented.

*Regarding data types in the database, currently, everything is VARCHAR throughout our table, so as not to complicate anything at the moment.*
 
## next-prisma-app (This is a more comprehensive implementation that includes authorization, server-side rendering, etc.)
By default, **sqlite** is currently used, but in the .env file, you can add the preferred database:

*For example*

- DATABASE_URL="file:./dev.db"

To

- DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

**Nothing prevents doing the same and hooking up routes on sequelize-server-client, scaling it as needed, etc. In general, the sequelize-server-client application is more of a classic SPA. Next.js provides more opportunities for server rendering.**
