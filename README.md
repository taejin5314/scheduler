# Interview Scheduler

Interview Scheduler is a modern client application using the React view library.

## Project Funtionality

- Development focuses on a single page application (SPA) called Interview Scheduler, built using React.
- Data is persisted by the API server using a PostgreSQL database.
- The client application communicates with an API server over HTTP, using the JSON format.
- Jest tests are used through the development of the project.

## Final Product

## Getting Started

1. Install dependencies with `npm install`.
2. Running Webpack Development Server by `npm start`.
3. The App will served at http://localhost:8000/

> **-IMPORTANT-**

- The app needs to be run alongside with [scheduler-api](https://github.com/taejin5314/scheduler-api) in order to receive data from axios requests.

## Jest

- Running Jest Test Framework with `npm test`.

## Storybook

- Running Storybook Visual Testbed with `npm run storybook`.

## Languages, Frameworks

**Scheduler**

- JSX, CSS, Javascript
- ReactJS, Cypress, Jest, Storybook, Axios

**Scheduler-api**

- Javascript
- NodeJS, Express
- PostgreSQL

## Dependencies

- Node v12.7.0
- Axios
- @testing-library/react-hooks
- React-test-renderer
- Storybook
- Jest
- ClassNames
- Cypress

## Deployed Client

- Application link: Powered by [Netlify](https://trusting-brattain-cd73c9.netlify.app/)

## Deployed Server

- Days api: Powered by [Heroku](https://scheduler-taejin5314.herokuapp.com/api/days)
- Appointments api: Powered by [Heroku](https://scheduler-taejin5314.herokuapp.com/api/appointments)
