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

**Login**

![Login](https://github.com/maxmax/pk-ukraina/raw/main/next-prisma-app/docs/login.png)

**Table**

![Table](https://github.com/maxmax/pk-ukraina/raw/main/next-prisma-app/docs/table.png)

**Detail**

![Detail](https://github.com/maxmax/pk-ukraina/raw/main/next-prisma-app/docs/detail.png)

**New**

![Detail](https://github.com/maxmax/pk-ukraina/raw/main/next-prisma-app/docs/new.png)

**Edit**

![Edit](https://github.com/maxmax/pk-ukraina/raw/main/next-prisma-app/docs/edit.png)

### General Overview of How Everything Works

**Main**

Creating a new Next.js project with TypeScript support using Create Next App:

~~~
npm create next-app next-prisma-app --ts
~~~

Installing the minimal set of npm packages required for our application to work:

#### Production dependencies

~~~
npm install @emotion/cache @emotion/react @emotion/server @emotion/styled @formkit/auto-animate @mui/icons-material @mui/joy @mui/material @prisma/client @welldone-software/why-did-you-render argon2 cookie jsonwebtoken multer next-connect react-error-boundary react-toastify swiper swr
~~~

#### Dependencies for development

~~~
npm install -D @types/cookie @types/jsonwebtoken @types/multer babel-plugin-import prisma sass
~~~

+ @mui/... - Material UI components and icons;
+ @emotion/... - CSS-in-JS solution used for styling Material UI components;
+ prisma - ORM for working with relational databases such as PostgreSQL, MySQL, SQLite, SQL Server, as well as NoSQL databases MongoDB and CockroachDB;
+ @prisma/client - Prisma client;
+ @welldone-software/why-did-you-render - a useful utility for debugging React applications that helps identify the reasons for component re-renders;
+ argon2 - utility for hashing and verifying passwords;
+ cookie - utility for working with cookies;
+ jsonwebtoken - utility for working with tokens;
+ multer - Node.js middleware for handling multipart/form-data (for working with files in the request);
+ next-connect - a library that allows working with Next.js route interface as with Express routes;
+ react-error-boundary - a React error boundary component for React applications;
+ react-toastify - component and utility for implementing notifications in React applications;
+ swiper - advanced slider component - it's an idea, but I might reconsider;
+ swr - React hooks for fetching data from the server, allowing to bypass the need for a state management tool;
+ @types/... - missing TypeScript types;
+ babel-plugin-import - Babel plugin for efficient tree shaking when importing MUI components by name;
+ sass - CSS preprocessor.

### Database Preparation and ORM Configuration

To store user data and information, we need a database. For simplicity, we will use SQLite, where data is stored as a file on the server. Prisma will be used to interact with SQLite. Later, we'll add a few more databases and run everything in Docker. Overall, there will be a separate feature and description for the databases.

*I recommend installing [this extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) for VSCode to work with the Prisma schema.*


#### Initializing Prisma while in the project's root directory:

~~~
npx prisma init
~~~

Executing this command generates the prisma directory and the .env file. Edit the schema.prisma file in the prisma directory, defining the database provider in the datasource block, and the user and information model in the model block. In other words, create models in /schema.prisma.

Edit the .env file, specifying the path to the database file in it:

~~~
DATABASE_URL="file:./dev.db"
~~~

#### Creating and applying a migration to the database:

~~~
npx prisma migrate dev --name init
~~~

Executing this command generates the migrations directory with the SQL migration.

Note: When running migrate dev for the first time, the Prisma client is automatically installed and generated. In the future, after any changes to the Prisma schema, you need to manually execute the command

~~~
npx prisma generate
~~~

To update the client.

Also, note that for a quick restoration of the initial state of the database with the loss of all data, you can delete the dev.db file and execute the command:

~~~
npx prisma db push
~~~

Now, let's set up the Prisma client. Create a file src/utils/prisma.ts with the following content:

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

This snippet ensures the existence of only one instance (singleton) of the Prisma client when working in both a production and a development environment. The reason is that in development mode, due to HMR, a new instance of the client is created when the module importing Prisma is reloaded.

#### We won't go into detail in the documentation about the implementation process, but we'll outline some key points.

Our application will consist of two pages: the main page and **Statements** (with a link to the implemented test task in the main menu). The main page will use static data in JSON format. In this case, the data for the main page will be stored locally. You can also implement this data on the server, but for now, we won't do that; it's more for demonstration.

For the main page, we'll implement static generation with data using the getStaticProps function. Perhaps we'll talk more about this later.

### Authentication and Authorization

**Auth**

For the authentication and authorization of users in our program, we will use a modern and one of the 'most secure schemes' – JSON Web Tokens + Cookie. At the highest level, this means:

+ To store the authentication state, the server generates an identity token (idToken) based on user data (e.g., their ID) and stores it in a cookie with special settings.
+ Based on the cookie from the user's request, the server determines whether the user is registered in the application. If the user is registered, the server obtains the user's ID from the identity token, retrieves user data from the database, and returns it to the client.
+ To access protected resources, the server generates an access token (accessToken) and returns it to the authorized client.
+ When accessing a protected resource, the server checks the presence and validity of the access token from the Authorization header of the request object.

#### Middleware and Authorization Utilities

Let's implement 2 middlewares and 1 authorization utility:

+ cookie - middleware for working with cookies;
+ authGuard – middleware for providing access to protected resources;
+ checkFields – utility for checking the presence of mandatory fields in the request body.

**Let's start by defining variables for cookies in the .env file:**

~~~
ID_TOKEN_SECRET="id-token-secret"
ACCESS_TOKEN_SECRET="access-token-secret"
COOKIE_NAME="uid"
~~~

*Note: In a real application, secrets should be long, randomly generated strings..

~~~
import { NextApiHandlerWithCookie } from '@/types'
import cookies from '@/utils/cookie'

const handler: NextApiHandlerWithCookie = async (req, res) => {
  console.log(res.cookie)
  // ...
}

export default cookies(handler)
~~~

Define types for the authGuard middleware in the src/types.ts file:

~~~
export type NextApiRequestWithUserId = NextApiRequest & {
  userId: string
}

export type NextApiHandlerWithUserId = (
	req: NextApiRequestWithUserId,
	res: NextApiResponse
) => unknown | Promise<unknown>

export type AuthGuardMiddleware = (
	handler: NextApiHandlerWithUserId
) => (req: NextApiRequestWithUserId, res: NextApiResponse) => void
~~~

**Defining a middleware to grant access to protected resources in the utils/authGuard.ts file:**

**Finally, defining a utility to check for the presence of mandatory fields in the request body in the utils/checkFields.ts file:**

*I think everything is clear here. 🐅?*

#### Authentication and Authorization Routes

Route interfaces are defined in the pages/api directory and are available at /api/*.

Create a directory named auth in it with files register.ts and login.ts.

**And define the route for registration in register.ts.**

We generate an access token with a long lifespan. This eliminates the need to renew it (generate a new token) in the authGuard middleware, for example. However, this is risky, so in a production application, the access token's lifespan should be approximately 1 hour. Also, a real application should have a mechanism for automatic extension of the identification token: in our application, the user should log in once a week.

**Define the route for authorization: login.ts**

Create a file auth/user.ts for the route to define the authentication status and retrieve user data.

**Define the route for auth/logout.ts**
Finally, define the route for the user to log out in the auth/logout.ts file.

*Thus, we have implemented 4 authentication and authorization routes:*

* POST /api/register - for user registration;
* POST /api/login - for user login to the system;
* GET /api/user - for retrieving data of the registered user;
* GET /api/logout - for user logout from the system.

#### File Upload

Users of our application will have the ability to upload avatars. Therefore, we need to implement a route for saving files on the server. Multer is commonly used to work with files in a request.

*Note: Next-connect will be used for implementing all the following routes.*

Create a file upload.ts in the api directory.
*This route is accessible at /api/upload via POST.*

*It should be noted that our implementation lacks logic for deleting old user avatars: the file name consists of the user ID and the file extension, meaning one user can have multiple files with different extensions. This only applies to files on the server; the avatarUrl field will always contain a link to the last uploaded file. Also, in a real application, it makes sense to define logic for reducing the size of the uploaded file, for example, by compressing it.*

### CRUD Operations for Statements

The server-side of our program is ready. Now we need to implement routes for adding, editing, and deleting.

Note: All the following routes are protected.

Also, note that routes for fetching all statements and one statement by ID will be implemented on the client side (client-side logic) using the getServerSideProps function.

**Create a file statement.ts in the api directory.**

In all cases, the response to the request includes statement data.

So, we have 3 routes for Statements:

* POST /api/statement - to create a statement;
* PUT /api/statement - to update a statement;
* DELETE /api/statement?id=<post-id> - to delete a statement.

**Also, define some security-related HTTP headers in next.config.js for all routes.**

## Client

*Project Configuration*

[Why Did You Render](https://github.com/welldone-software/why-did-you-render) – a utility for debugging React applications that allows identifying the reason for component re-rendering. To use this utility in a Next.js application, you need to do two things:

+ Configure the Babel transpiler preset;
+ Initialize the utility and import it into the main program component.

Configure the Babel preset in the babel.config.js file at the project's root:

~~~
module.exports = function (api) {
  const isServer = api.caller((caller) => caller?.isServer)
  const isCallerDevelopment = api.caller((caller) => caller?.isDev)

  // presets
  const presets = [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource:          
            // The wdyr code should only run on the client
            // and only in development mode
            !isServer && isCallerDevelopment
              ? '@welldone-software/why-did-you-render'
              : 'react'
        }
      }
    ]
  ]

  return { presets }
}
~~~

**Initialize WDYR in the utils/wdyr.ts file:**

~~~
import React from 'react'

// Code executed only in development mode
// and only on the client side
if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true
  })
}

export {}
~~~

Import WDYR in the _app.tsx file:

~~~
import '@/utils/wdyr'
~~~

After this, to enable it in the component file, it is sufficient to add the following line:

~~~
SomeComponent.whyDidYouRender = true
~~~

##### Material UI

Material UI is the most popular React component library. To use it correctly in a Next.js application, you need to do two things:

+ Configure the Babel plugin.
+ Configure the Emotion cache - a CSS-in-JS solution used by MUI for styling components.

Let's configure the Babel plugin in the babel.config.js file:

~~~
module.exports = function (api) {
  // Presets
  // ...

  // Plugins
  const plugins = [
    [
      'babel-plugin-import',
      {
        libraryName: '@mui/material',
        libraryDirectory: '',
        camel2DashComponentName: false
      },
      'core'
    ]
  ]

  return { presets, plugins }
}
~~~

**Why do we need this plugin? To reduce the size of the client bundle. The problem is that when importing an MUI component by name, for example:**

~~~
import { Button } from '@mui/material'
~~~

The entire @mui/material package, i.e., all MUI components, regardless of whether they are used in the application or not, will end up in the bundle. babel-plugin-import transforms named imports into default ones, so, for example, we get:

~~~
import Button from '@mui/material/Button'
~~~

This way, only the components used in the application end up in the bundle.

Configuring the Emotion cache is necessary to prevent a flash of unstyled content, for example, when default browser styles are loaded initially and only then the MUI styles. It also provides the ability to easily override MUI styles, i.e., customize components.

*Let's define a utility for creating the Emotion cache in the file*

**Defining the utility for creating the Emotion cache in the file**

+ utils/createEmotionCache.ts

~~~
import createCache from '@emotion/cache'

// Create a `meta` tag with `name="emotion-insertion-point"` at the beginning of <head> on the client.
// This allows loading MUI styles in a prioritized order.
// It also enables developers to easily override MUI styles, for example, using CSS modules.

export default function createEmotionCache() {
  let insertionPoint

  if (typeof document !== 'undefined') {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    )
    insertionPoint = emotionInsertionPoint ?? undefined
  }

  return createCache({ key: 'mui-style', insertionPoint })
}
~~~

The cache needs to be created during the program's execution, both on the server and the client.

+ Configure document rendering in the file _document.tsx (creating the cache on the server).
+ Configure component rendering in the file _app.tsx (creating the cache on the client).

#### Structuring Components

Our application will utilize several "global" components:

+ Notification component (react-toastify)
+ Error boundary component (react-error-boundary)

We will have a common layout for all pages of the application, and we will structure it directly in _app.tsx.

Additionally, we will animate the transition between pages using @formkit/auto-animate (consider this utility as a modern alternative to React Transition Group).

Importing components and styles, let's structure the components in _app.tsx.

+ Add a component to add metadata to the head section of the document (components/head.tsx)
+ Fallback component (components/ErrorFallback.tsx)
+ Website footer (components/Footer.tsx)
+ Website header (components/Header.tsx)
+ Desktop menu (components/Menu/Desktop.tsx): *This component is a list of links and a profile button.*
+ Mobile menu (components/Menu/Mobile.tsx)

#### Authentication, Authorization, and File Upload

Upon startup, the program requests user data from the server. These are the only data the application "observes" when changed. User data retrieval is implemented using SWR. SWR allows caching data and mutating it as needed, for example, after user registration. Thanks to SWR, we can manage without a state management tool.

- Define an abstraction over SWR for fetching user data in the file utils/swr.ts:

#### Authentication and Authorization

- In the website header, there is a profile button (Buttons/Profile.tsx)

- The functionality of registration, authentication, avatar uploads, and logout is encapsulated in a modal window (components/Modal.tsx):

- In the absence of user data, the content of the modal consists of authentication tabs (components/AuthTabs.tsx):

- Registration form (components/Forms/Register.tsx):

#### User Panel

If user data is available, the content of the modal that renders upon clicking the profile button is the User Panel (components/UserPanel.tsx), which includes a form for uploading an avatar and a button for user logout:

- Avatar upload form (components/Forms/Upload.tsx)
- Logout button (components/Buttons/Logout.tsx)

*After uploading the avatar, the user's profile picture is displayed in the website header in place of the profile button.*

#### Creating, Updating, Deleting Statements

To create the "Carrier Movement Information" page and detailed pages, server-side rendering is used with the help of the getServerSideProps function. This function allows executing server-side code and will be called with each page request.

On the "Carrier Movement Information" page (pages/statement/index.tsx), a button for creating a new statement and its list in the form of a table (if available) are rendered:

* Create statement button (components/Button/CreateStatement.tsx)
* Statement creation form (components/Forms/CreateStatement.tsx)
* Statement page (pages/statement/[id].tsx)
* Delete statement button (components/Buttons/RemoveStatement.tsx)
* Edit statement button (components/Buttons/EditStatement.tsx)

*Upon clicking this button, a modal is rendered with a form for editing the statement (components/Forms/EditStatement.tsx), which is almost identical to the post creation form.*


**With a general description of the functionality, we conclude for now, reducing the irony level to 0.5% 🗿🗿🗿, and wish everyone a good day.**
