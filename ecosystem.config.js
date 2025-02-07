require('dotenv').config();

module.exports = {
  apps: [
    {
      script: '/home/app/api/src/main.js',
      instances: 'max',
      name: 'api-tech-interview-loadbalancer',
      exec_mode: 'cluster',
      node_args: '--max_old_space_size=2048',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env: {
        APP_PORT: process.env.APP_PORT,
        NODE_ENV: process.env.NODE_ENV,
        CORS_RELEASED_DOMAINS: process.env.CORS_RELEASED_DOMAINS,
        JWT_SECRET: process.env.JWT_SECRET,
        DATABASE_TYPE: process.env.DATABASE_TYPE,
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_PORT: process.env.DATABASE_PORT,
        DATABASE_USERNAME: process.env.DATABASE_USERNAME,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        DATABASE_NAME: process.env.DATABASE_NAME,
        DATABASE_NAME_SCHEMA: process.env.DATABASE_NAME_SCHEMA,
        PGADMIN_DEFAULT_EMAIL: process.env.PGADMIN_DEFAULT_EMAIL,
        PGADMIN_DEFAULT_PASSWORD: process.env.PGADMIN_DEFAULT_PASSWORD,
        PGADMIN_PORT: process.env.PGADMIN_PORT,
        WEBHOOK_PASSWORD: process.env.WEBHOOK_PASSWORD,
        WEBHOOK_USERNAME: process.env.WEBHOOK_USERNAME,
        WEBHOOK_CALLBACK_COMPANY_URL: process.env.WEBHOOK_CALLBACK_COMPANY_URL,
      },
    },
  ],
};
