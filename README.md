# Open source project matching platform

Hack Days is an open-source project finding/matching platform for connecting good projects and good people.
Currently in development.

## Website

Still in development. Coming soon!

## Requirement

- Git
- Docker (make sure the daemon is up and running)
- Supabase CLI (instructions [here](https://github.com/supabase/cli))

## Getting Started

### launch supabase

Clone

```bash
clone https://github.com/codeforjapan/hackdays.git
```

Launch supabase

```bash
supabase start
```

You will see following outputs. please copy `anon key`.

```text
         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.ZopqoUt20nEV9cklpv9e3yw3PVyZLmKs5qLD6nGL1SI
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.M2d2z4SFn5C7HlJlaSLfrzuYim9nbY_XI40uWFN3hEE
```

### Create .env.development.local

Copy sample env file

```bash
cp .env.development.local.sample .env.development.local
vi .env.development.local
```

Replace the YOUR_ANON_KEY_HERE to the `anon key` copied at previous step.

```text
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE <- replace this
```

note: If you want to use supabase server instance, please use server's `API URL` and `anon key`. (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for details)

### launch site

```bash
# instlal dependencies
yarn install
# launch website
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can access a supabase studio with [http://localhost:54323/](http://localhost:54323/).

Also, you can access email logs with [http://localhost:54324/](http://localhost:54324/).

## CAUTION

Currently, Strage function is not supported for the local supabase environment.
You have to use a server instance for checking the features using Storage, ex. Profile photos.

## Deployment

see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Run tests

### Cypress

Cypress is used for End-to-End (E2E) and Integration Testing.

Before you run a test, you have to create `.env.production.local` and copy the contents of `.env.development.local` to it.

> Note: this is because the environmental variables related to Supabase must be defined to build the entire app. We're making the app able to be built without Supabase connected, to run the tests in CI where Supabase may not be configured.

To run Cypress tests, first run `yarn build && yarn start`, and then, in another terminal:

```bash
yarn cypress

# Or, if you want to run in headless mode that is suitable to Docker
# yarn cypress:headless
```

If you want to start the Next.js server and Cypress at the same time, the `start-server-and-test` package will help you. ([Details](https://nextjs.org/docs/testing#running-your-cypress-tests))

### Unit tests (Jest + React Testing Library)

The unit tests are built with Jest and React Testing Library, generally located at `__test__/` directory.

`yarn test` will run the tests in watch mode, where they will be re-run when a file is changed, while `yarn test:ci` will run them only once, which will be best for CI.

## License

MIT License

## Learn More

To learn more about this project, please visit [Our document site](https://hackmd.io/@codeforjapan/Hkc4eIKht/)
