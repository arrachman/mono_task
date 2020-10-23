## Get Started
Follow instructions to clone and run project

#### Prerequisites
- [Lerna](https://github.com/lerna/lerna): installed globally. `npm i lerna -g`

### Clone repository
`git clone https://github.com/arrachman/mono_task`

### Install dependencies using lerna
`lerna bootstrap`

### Setting env
`setting env from apps/api/env`

### Export database mysql
`export db from db.sql`

### Run project
- **API backend**
`npm start --prefix apps/api`
- **frontend**
`npm start --prefix apps/frontend`
