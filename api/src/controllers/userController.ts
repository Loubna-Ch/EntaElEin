import { Request, Response, NextFunction } from 'express';
import UserService from '../services/userService';

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
      const { id } = req.params; 
      const user = await UserService.getById(Number(id));
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
      const { id } = req.params;
      const body = req.body;
      const user = await UserService.update(Number(id), body);

      const io = req.app.get('socketio');
      if (io) io.emit('user-updated', user);

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await UserService.remove(Number(id));

      const io = req.app.get('socketio');
      if (io) io.emit('user-deleted', id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}