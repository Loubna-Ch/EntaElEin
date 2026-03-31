import { Request, Response, NextFunction } from 'express';
import ParticipantsService from 'src/services/participantService';

export class ParticipantController {

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const participants = await ParticipantsService.getAll();
      return res.json(participants);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; 
      const participant = await ParticipantsService.getById(Number(id));
      return res.json(participant);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body; 
      const participant = await ParticipantsService.create(body);

      const io = req.app.get('socketio');
      if (io) io.emit('participant-added', participant);

      return res.status(201).json(participant);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;
      const participant = await ParticipantsService.update(Number(id), body);

      const io = req.app.get('socketio');
      if (io) io.emit('participant-updated', participant);

      return res.json(participant);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ParticipantsService.remove(Number(id));

      const io = req.app.get('socketio');
      if (io) io.emit('participant-deleted', id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}