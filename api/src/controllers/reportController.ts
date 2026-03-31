import { Request, Response, NextFunction } from 'express';
import ReportService from '../services/reportService';

export class ReportController {

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await ReportService.getAll();
      return res.json(reports);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; 
      const user = await ReportService.getById(Number(id));
      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body; 
      const user = await ReportService.create(body);

      const io = req.app.get('socketio');
      if (io) io.emit('report-added', user);

      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await ReportService.update(Number(id), body);

      const io = req.app.get('socketio');
      if (io) io.emit('report-updated', user);

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ReportService.remove(Number(id));

      const io = req.app.get('socketio');
      if (io) io.emit('report-deleted', id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}