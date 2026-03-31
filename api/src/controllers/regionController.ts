import { Request, Response, NextFunction } from 'express';
import RegionService from '../services/regionService';

export class RegionController {

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const regions = await RegionService.getAll();
      return res.json(regions);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; 
      const user = await RegionService.getById(Number(id));
      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body; 
      const user = await RegionService.create(body);

      const io = req.app.get('socketio');
      if (io) io.emit('region-added', user);

      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await RegionService.update(Number(id), body);

      const io = req.app.get('socketio');
      if (io) io.emit('region-updated', user);

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await RegionService.remove(Number(id));

      const io = req.app.get('socketio');
      if (io) io.emit('region-deleted', id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}