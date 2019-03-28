# Koa typescript boilerplate

## Environment

* Node: `11.12.0`
* Platform: `macOS 10.14.3`

## Features

* [x] Typescript + Koa2  
* [x] Auto regist controller to router  
* [x] Typeorm + MySQL

## Project Structure

```bash
├── README.md
├── app
│   ├── app.ts # main
│   ├── config # development and production config
│   ├── controllers # router controller
│   ├── middlewares
│   ├── models
│   ├── public
│   ├── services
│   ├── typings
│   └── utils
├── ecosystem.config.js # pm2 ecosystem
├── index.ts
├── package.json
├── test
│   └── jest.config.js
├── tsconfig.json
├── tslint.json
└── yarn.lock
```

## Run

```bash
yarn
yarn debug
```

## Visual Studio Code

### Extensions

* [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
