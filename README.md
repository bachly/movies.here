# Movies Here

This project is built using NextJS, TailwindCSS, Cypress and TMDB API.

Demo: [https://movies.here.li/](https://movies.here.li/).

The Frontend is built with NextJS, ReactJS and TailwindCSS.

The Backend includes the serverless functions running on `/api`.

## Commands

```
// Install dependencies
yarn install

// Run development environment locally
yarn dev

// Run E2E Visual Test, while runing `yarn dev` in a separate processs
yarn cypress

// Udate E2E Visual Test snapahots, while running `yarn dev` in a separate processs
// 1. Delete old snapshots
// 2. Run `yarn cypress` and run the snapshot tests again
```

## Configurations

### Environment variables

Environment variables are stored in `.env.local` for local development

Rename `.env.example` to `.env.local` and add the API keys accordingly

### TailwindCSS

TailwindCSS is configured in `tailwind.config.js` and `postcss.config.js`

Other custom CSS can be found in `styles/main.scss`

### Cypress E2E testing

Cypress is configured in `cypress.json`

There are 2 types of Cypress tests: `integration` and `snapshots`.

Integration tests are run against expected values. Snapshot tests are run against expected snapshots.

Snapshots are saved in `/cypress/snapshots`.

MP4 Videos are saved in `/cypress/videos`.

## Deployment

The project is deployed to Vercel or Netlify via GitHub hook.
