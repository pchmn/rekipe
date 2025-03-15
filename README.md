# Monorepo Template

This a monorepo template for Typescript projects.

## Features

- 📦 [pnpm](https://pnpm.io/) for fast, disk space efficient package management
- 🏗️ [Turborepo](https://turbo.build/) for efficient build system and task running
- 🔷 [TypeScript](https://www.typescriptlang.org/) for type safety
- 🔨 [Biome](https://biomejs.dev/) for fast consistent code formatting and linting
- 🎨 [Tailwind CSS](https://tailwindcss.com/) support with VS Code integration
- 📱 Workspace structure for apps and packages
- 🔄 Automated dependency version synchronization
- 🛠️ VS Code configuration for optimal developer experience

## Code organization

The monorepo is organized into two main directories:

- `apps/`: Contains all the applications that can be deployed independently
- `packages/`: Contains shared packages/libraries used across applications

## Prerequisites

- [`Dockploy`](https://docs.dokploy.com/docs/core) server in order to deploy apps
- [`Supabase`](https://supabase.com/) account for the database and auth
- [`Docker`](https://www.docker.com/) registry in order to build the docker images
- [`Google`](https://console.cloud.google.com/) account for the Google oauth configuration

## Getting Started

Once this template cloned, there is a task list in order to start fresh and without problems :
- [x] 1. Reset project (set version to 0.0.0 and rename project): `pnpm reset-project <new_project_name>`
- [x] 2. Install dependencies: `pnpm i`
- [X] 3. Create a new project on your `Dokploy` server and replace `project-id` in `preview-up.yml`, `preview-down.yml` and `production.yml` workflows with your project id
- [x] 4. Create 2 new projects on your `Supabase` account: one for the previews and one for the production
- [x] 5. Create these repository secrets on GitHub:
  - [x] `DOCKER_USERNAME`: Your Docker registry username
  - [x] `DOCKER_PASSWORD`: Your Docker registry password
  - [x] `DOKPLOY_BASE_URL`: The base URL of your Dokploy instance
  - [x] `DOKPLOY_TOKEN`: Authentication token for Dokploy API access
  - [x] `PREVIEW_SESSION_SECRET`: Secret key for preview environment sessions
  - [x] `PREVIEW_SUPABASE_ANON_KEY`: Anon key for preview Supabase project
  - [x] `PREVIEW_SUPABASE_DB_PASSWORD`: Database password for preview Supabase project
  - [x] `PREVIEW_SUPABASE_PROJECT_ID`: Project ID for preview Supabase instance
  - [x] `PREVIEW_SUPABASE_SERVICE_ROLE_KEY`: Service role key for preview Supabase project
  - [x] `PREVIEW_SUPABASE_URL`: URL for preview Supabase instance
  - [x] `PRODUCTION_SESSION_SECRET`: Secret key for production environment sessions
  - [x] `PRODUCTION_SUPABASE_ANON_KEY`: Anon key for production Supabase project
  - [x] `PRODUCTION_SUPABASE_DB_PASSWORD`: Database password for production Supabase project
  - [x] `PRODUCTION_SUPABASE_PROJECT_ID`: Project ID for production Supabase instance
  - [x] `PRODUCTION_SUPABASE_SERVICE_ROLE_KEY`: Service role key for production Supabase project
  - [x] `PRODUCTION_SUPABASE_URL`: URL for production Supabase instance
  - [x] `SUPABASE_ACCESS_TOKEN`: Access token for Supabase API
- [x] 6. Create a Google project and configure OAuth 2.0 credentials for the web app and connect it to your `Supabase` projects
- [x] 7. Enable anonymous sign-ins in your `Supabase` projects

You should be good to go with a fresh new project!

## CI

### Preview Deployments

The repository includes automated preview deployment workflows that manage preview environments for pull requests:

#### Preview Creation (`preview-up.yml`)

When a PR is opened, reopened, synchronized, or marked ready for review, the workflow:

1. Run Supabase migrations on the preview database
2. Builds a Docker image of the application
3. Deploys it to [Dokploy](https://dokploy.com) with a unique preview URL
4. Comments on the PR with the preview URL

#### Preview Cleanup (`preview-down.yml`)

When a PR is closed (merged or abandoned), the workflow automatically:

1. Removes the preview deployment from Dokploy
2. Cleans up associated resources

### Production Deployment

The repository includes automated production deployment workflows that manage the production environment:

#### Production Deployment (`production.yml`)

When a PR is merged, the workflow:

1. Runs Supabase migrations on the production database
2. Creates a new release (tag, changelog, etc)
3. Builds a Docker image of the application with the new version
4. Pushes it to the Docker registry
5. Deploys it to Dokploy
