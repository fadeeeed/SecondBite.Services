import 'reflect-metadata';
import express from 'express';
import { NODE_ENV, PORT } from '@config';
import { IRoutes } from '@interfaces/routes.interface';
import cors from 'cors';
import helmet from 'helmet';
import { ErrorMiddleware } from '@middlewares/error.middleware';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: IRoutes[]) {
    this.app = express();
    this.env = NODE_ENV || 'dev';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.app.use(ErrorMiddleware);
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors({ origin: '*', credentials: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: IRoutes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }
}

export default App;
