import { Controller, Get, Post, Put, Delete, Param, Body, Res, Req, Next, HttpStatus } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express'; 
import UserService, { } from '../services/userService';
@Controller('users')
export class UserController {
    
    @Get()
    static async getAll(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const users = await UserService.getAll();
            return res.json(users);
        } catch (err) {
            next(err);
        }
    }

    @Get(':id')
    static async getById(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const user = await UserService.getById(Number(id));
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    @Post()
    static async create(@Body() body: any, @Req() req: any, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const user = await UserService.create(body);
            
            // Real-time notification for EntaElEin (if Socket.io is configured)
            const io = req.app.get('socketio');
            if (io) io.emit("user-added", user);
            
            return res.status(HttpStatus.CREATED).json(user);
        } catch (err) {
            next(err);
        }
    }

    @Put(':id')
    static async update(@Param('id') id: string, @Body() body: any, @Req() req: any, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const user = await UserService.update(Number(id), body);
            
            const io = req.app.get('socketio');
            if (io) io.emit("user-updated", user);
            
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    @Delete(':id')
    static async remove(@Param('id') id: string, @Req() req: any, @Res() res: Response, @Next() next: NextFunction) {
        try {
            await UserService.remove(Number(id));
            
            const io = req.app.get('socketio');
            if (io) io.emit("user-deleted", id);
            
            return res.status(HttpStatus.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    }
}