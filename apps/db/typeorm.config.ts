import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  migrations: ['./migrations/*.ts'],
  // entities: ['../app/src/db/*.entity.ts'], // for generating migrations
});
