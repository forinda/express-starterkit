import { Container } from 'inversify';
import { TYPES } from './types';
import { UserService } from '../services/user.service';
import { AuthController } from '../controllers/auth.controller';

const container = new Container();

// Bind services
container.bind<UserService>(TYPES.UserService).to(UserService);

// Bind controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

export { container };
