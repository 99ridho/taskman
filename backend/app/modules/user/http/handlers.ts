import { Request, Response } from 'express';
import { UserUseCase } from '../usecase';

export default class UserHandlers {
  private useCase: UserUseCase;

  constructor(usecase: UserUseCase) {
    this.useCase = usecase;
  }

  async login(req: Request, res: Response) {
    try {
      const token = await this.useCase.login(req.body);
      res.status(200).json({
        data: token,
      });
    } catch (err) {
      throw err;
    }
  }

  async register(req: Request, res: Response) {
    try {
      const token = await this.useCase.registerUser(req.body);
      res.status(200).json({
        data: token,
      });
    } catch (err) {
      throw err;
    }
  }
}
