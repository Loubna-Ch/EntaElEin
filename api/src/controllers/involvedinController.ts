import { Request, Response, NextFunction } from 'express';
import InvolvedInService from '../services/involvedinService';
import RegionService from 'src/services/regionService';

export class InvolvedInController {

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const involvedIns = await InvolvedInService.getAll();
      return res.json(involvedIns);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; 
      const user = await InvolvedInService.getById(Number(id));
      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body; 
      const user = await InvolvedInService.create(body);

      const io = req.app.get('socketio');
      if (io) io.emit('involvedin-added', user);

      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await InvolvedInService.update(Number(id), body);

      const io = req.app.get('socketio');
      if (io) io.emit('involvedin-updated', user);

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await InvolvedInService.remove(Number(id));

      const io = req.app.get('socketio');
      if (io) io.emit('involvedin-deleted', id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}