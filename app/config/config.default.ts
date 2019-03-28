export interface Config {
  mysql: {
    database: string
    username: string
    password: string
    host: string
    port: number
  }
}

const config: Config = {
  mysql: {
    database: '',
    username: '',
    password: '',
    host: '127.0.0.1',
    port: 3306,
  },
}

export default config
