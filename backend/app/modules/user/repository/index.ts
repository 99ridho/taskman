import { UserDTO } from '../dto';

export default interface UserRepository {
  findByUserID(userID: string): Promise<UserDTO>;
  findByUsername(username: string): Promise<UserDTO>;
  deleteByUserID(userID: string): Promise<boolean>;
  updateByUserID(userID: string, arg: UserDTO): Promise<UserDTO>;
  createUser(arg: UserDTO): Promise<string>;
  countByUsername(username: string): Promise<number>;
}
