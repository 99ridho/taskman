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
      const id = await this.useCase.registerUser(req.body);
      res.status(200).json({
        data: id,
      });
    } catch (err) {
      throw err;
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (req.user?.user_id) {
        const profile = await this.useCase.getProfile(req.user?.user_id);
        res.status(200).json({
          data: {
            user_id: profile.user_id,
            username: profile.username,
            created_at: profile.created_at,
          },
        });
        return;
      }

      res.status(204).json(null);
    } catch (err) {
      throw err;
    }
  }
}
