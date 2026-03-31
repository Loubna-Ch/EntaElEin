import { Request, Response, NextFunction } from 'express';
import HadasService from '../services/hadasService';
import RegionService from 'src/services/regionService';

export class HadasController {

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const hadas = await HadasService.getAll();
      return res.json(hadas);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; 
      const hadas = await HadasService.getById(Number(id));
      return res.json(hadas);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body; 
      const hadas = await HadasService.create(body);

      const io = req.app.get('socketio');
      if (io) io.emit('hadas-added', hadas);

      return res.status(201).json(hadas);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;
      const hadas = await HadasService.update(Number(id), body);

      const io = req.app.get('socketio');
      if (io) io.emit('hadas-updated', hadas);

      return res.json(hadas);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await HadasService.remove(Number(id));

      const io = req.app.get('socketio');
      if (io) io.emit('hadas-deleted', id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}