module.exports = {
  db: {
    operatorsAliases: false,
    dialect: 'postgres',
    name: 'devconnector',
    host: process.env.POSTGRES_DEVCONNECTOR_HOST || 'localhost',
    username: process.env.POSTGRES_DEVCONNECTOR_USER || 'postgres',
    password: process.env.POSTGRES_DEVCONNECTOR_PASSWORD || 'bdpass',
    database: process.env.POSTGRES_DEVCONNECTOR_DATABASE || 'devconnector',
    port: process.env.POSTGRES_DEVCONNECTOR_PORT || 5432,
    pool: {
      min: process.env.POSTGRES_DEVCONNECTOR_MIN_POOL || 0,
      max: process.env.POSTGRES_DEVCONNECTOR_MAX_POOL || 50,
      idle: 10000,
    },
    logging: false,
    timezone: 'America/Sao_Paulo',
  },
  log: 'info',
  secret: 'secret',
};
