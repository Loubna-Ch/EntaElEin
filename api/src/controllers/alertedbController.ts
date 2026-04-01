import { Request, Response, NextFunction } from 'express';
import AlertedByService from 'src/services/alertedbyService';

export class AlertedByController {

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const alertedBys = await AlertedByService.getAll();
      return res.json(alertedBys);
    } catch (err) {
      next(err);
    }
  }

  static async getByIds(req: Request, res: Response, next: NextFunction) {
    try {
      const { userid, alertid } = req.params; 
      const result = await AlertedByService.getByIds(Number(userid), Number(alertid));
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body; 
      const result = await AlertedByService.create(body);
      const io = req.app.get('socketio');
      
      if (io) io.emit('alertedby-added', result);
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { userid, alertid } = req.params;
      const body = req.body;
      const result = await AlertedByService.update(
        Number(userid), 
        Number(alertid), 
        body
      );

      const io = req.app.get('socketio');
      if (io) io.emit('alertedby-updated', result);

      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { userid, alertid } = req.params;
      await AlertedByService.remove(Number(userid), Number(alertid));

      const io = req.app.get('socketio');
      if (io) io.emit('alertedby-deleted', { userid, alertid });

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}