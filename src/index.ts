import 'reflect-metadata';
import { di } from '@/core/di/container';
import { AppModule } from '@/app/module';

// Get the app module from the container
const appModule = di.get(AppModule);

// Initialize and start the application
appModule.initialize().then(() => {
  appModule.start();
});
