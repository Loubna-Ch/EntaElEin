import { Request, Response, NextFunction } from 'express';
import InvolvedInService from '../services/involvedinService';

export class InvolvedInController {

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const involvedIns = await InvolvedInService.getAll();
      return res.json(involvedIns);
    } catch (err) {
      next(err);
    }
  }

  static async getByIds(req: Request, res: Response, next: NextFunction) {
    try {
      const { participantid, reportid } = req.params; 
      const result = await InvolvedInService.getByIds(Number(participantid), Number(reportid));
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body; 
      const result = await InvolvedInService.create(body);

      const io = req.app.get('socketio');
      if (io) io.emit('involvedin-added', result);

      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { participantid, reportid } = req.params;
      const body = req.body;
      const result = await InvolvedInService.update(
        Number(participantid), 
        Number(reportid), 
        body
      );

      const io = req.app.get('socketio');
      if (io) io.emit('involvedin-updated', result);

      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { participantid, reportid } = req.params;
      await InvolvedInService.remove(Number(participantid), Number(reportid));

      const io = req.app.get('socketio');
      if (io) io.emit('involvedin-deleted', { participantid, reportid });

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}