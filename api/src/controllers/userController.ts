import { Request, Response, NextFunction } from 'express';
import UserService from '../services/userService';
import { ApiError } from '../middlewares/ApiError';

export class UserController {

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAll();
      return res.json(users);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id < 1) {
        throw ApiError.badRequest('Invalid user id');
      }
      const user = await UserService.getById(id);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async getByEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.params;

    if (typeof email !== 'string') {
      throw ApiError.badRequest("Invalid email format");
    }

    const user = await UserService.getByEmail(email);
    return res.json(user);
  } catch (err) {
    next(err);
  }
}

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body; 
      const user = await UserService.create(body);

      const io = req.app.get('socketio');
      if (io) io.emit('user-added', user);

      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id < 1) {
        throw ApiError.badRequest('Invalid user id');
      }
      const body = req.body;
      const user = await UserService.update(id, body);

      const io = req.app.get('socketio');
      if (io) io.emit('user-updated', user);

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id < 1) {
        throw ApiError.badRequest('Invalid user id');
      }
      await UserService.remove(id);

      const io = req.app.get('socketio');
      if (io) io.emit('user-deleted', id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}