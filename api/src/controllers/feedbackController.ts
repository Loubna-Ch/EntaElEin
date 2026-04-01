import { Request, Response, NextFunction } from 'express';
import FeedbackService from '../services/feedbackService';

export class FeedbackController {

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const feedback = await FeedbackService.getAll();
      return res.json(feedback);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; 
      const feedback = await FeedbackService.getById(Number(id));
      return res.json(feedback);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body; 
      const feedback = await FeedbackService.create(body);

      const io = req.app.get('socketio');
      if (io) io.emit('feedback-added', feedback);

      return res.status(201).json(feedback);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;
      const feedback = await FeedbackService.update(Number(id), body);

      const io = req.app.get('socketio');
      if (io) io.emit('feedback-updated', feedback);

      return res.json(feedback);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await FeedbackService.remove(Number(id));

      const io = req.app.get('socketio');
      if (io) io.emit('feedback-deleted', id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}