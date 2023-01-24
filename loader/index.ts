import express, { Express } from 'express';
import cors from 'cors';

const allowedOrigin = ["https://walk.vercel.app", 'http://localhost:3000', 'http://localhost:8000'];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigin,
};

export const initLoader = (app: Express) => {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};
