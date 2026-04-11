import { UserRepository } from '../repositories/userRepository';
import { ApiError } from '../middlewares/ApiError';

class UserService {
  static async getAll() {
    return await UserRepository.findAll();
  }

  static async getById(id: number) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw ApiError.notFound(`User with id ${id} not found`);
    }
    return user;
  }

  static async getByEmail(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw ApiError.notFound(`User with email ${email} not found`);
    }
    return user;
  }

  static async create(data: {
    username: string;
    email: string;
    password: string;
    phonenumber?: string;
    address?: string;
    dateofbirth?: string;
    role?: string;
    regionid?: number;
  }) {

    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict('A user with this email already exists');
    }

    return await UserRepository.create(data);
  }

  static async update(
    id: number,
    updateData: {
      username: string;
      email: string;
      phonenumber?: string;
      address?: string;
      dateofbirth?: string;
      role?: string;
    },
  ) {
    const user = await UserRepository.update(id, updateData);
    if (!user) {
      throw ApiError.notFound(`User with id ${id} not found`);
    }
    return user;
  }

  static async remove(id: number) {
    const deleted = await UserRepository.remove(id);
    if (!deleted) {
      throw ApiError.notFound(`User with id ${id} not found`);
    }
    return { success: true, message: 'User deleted' };
  }
}

export default UserService;
