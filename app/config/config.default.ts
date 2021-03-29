export interface Config {
  mysql: {
    database: string
    username: string
    password: string
    host: string
    port: number
    charset: string
  };
}

const config: Config = {
  mysql: {
    database: '',
    username: '',
    password: '',
    host: '127.0.0.1',
    port: 3306,
    charset: 'utf8',
  },
};

export default config;
