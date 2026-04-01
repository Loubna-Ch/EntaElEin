import { Request, Response, NextFunction } from 'express';
import AlertFromAiService from '../services/alertfromaiService';

export class AlertFromAiController {

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const alerts = await AlertFromAiService.getAll();
      return res.json(alerts);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; 
      const alert = await AlertFromAiService.getById(Number(id));
      return res.json(alert);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body; 
      const alert = await AlertFromAiService.create(body);

      const io = req.app.get('socketio');
      if (io) io.emit('alert-from-ai-added', alert);

      return res.status(201).json(alert);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;
      const alert = await AlertFromAiService.update(Number(id), body);

      const io = req.app.get('socketio');
      if (io) io.emit('alert-from-ai-updated', alert);

      return res.json(alert);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AlertFromAiService.remove(Number(id));

      const io = req.app.get('socketio');
      if (io) io.emit('alert-from-ai-deleted', id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}