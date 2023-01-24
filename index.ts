import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { initLoader } from './loader';
import locationRouter from './routes/location';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const initApp = (app: Express) => {
  initLoader(app);

  app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
  });
  app.use('/map', locationRouter);
  
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

initApp(app);

module.exports = app;
