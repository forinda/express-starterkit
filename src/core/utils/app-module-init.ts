import { Application, Router } from 'express';
import { injectable } from 'inversify';

@injectable()
export class InitExpressApp {
  private router: Router = Router({ caseSensitive: true });

  initApp(app: Application) {
    app.use('/api/v1', this.router);
  }
}
