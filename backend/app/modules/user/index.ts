import { jwtMiddleware } from '../../middlewares/jwt';
import UserHandlers from './http/handlers';
import UserRepository from './repository';
import { UserUseCase } from './usecase';
import express from 'express';

export default class UserModule {
  private userUseCase: UserUseCase;
  private userHandlers: UserHandlers;

  constructor(userRepository: UserRepository) {
    this.userUseCase = new UserUseCase(userRepository);
    this.userHandlers = new UserHandlers(this.userUseCase);
  }

  router(): express.Router {
    const router = express.Router();
    router.post('/login', this.userHandlers.login.bind(this.userHandlers));
    router.post(
      '/register',
      this.userHandlers.register.bind(this.userHandlers),
    );
    router.get(
      '/profile',
      jwtMiddleware,
      this.userHandlers.getProfile.bind(this.userHandlers),
    );

    return router;
  }
}
