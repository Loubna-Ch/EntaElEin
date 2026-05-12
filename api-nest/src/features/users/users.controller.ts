import { Body, Controller, Get, Post, UseGuards, Patch, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	// Create a new user account.
	// Parameters: CreateUserDto from the request body.
	// Returns: the created user without the password.
	@ApiOperation({ summary: 'Create user' })
	@ApiResponse({ status: 201, description: 'Creates a user.' })
	@Post()
	async create(@Body() dto: CreateUserDto) {
		const user = await this.usersService.create(dto);
		return this.usersService.sanitizeUser(user);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	// Return the list of users for a logged-in request.
	// Parameters: none.
	// Returns: an array of users.
	@ApiOperation({ summary: 'List users' })
	@ApiResponse({ status: 200, description: 'Returns all users.' })
	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Update current user region' })
	@ApiResponse({ status: 200, description: 'Region updated successfully.' })
	@Patch('me/region')
	async updateMyRegion(@Request() req: any, @Body() body: { regionid?: number }) {
		const userid = Number(req.user?.userid);
		const regionid = Number(body?.regionid);

		if (!userid) {
			throw new BadRequestException('Invalid authenticated user');
		}
		if (!Number.isInteger(regionid) || regionid <= 0) {
			throw new BadRequestException('regionid must be a positive integer');
		}

		const updated = await this.usersService.updateRegion(userid, regionid);
		return this.usersService.sanitizeUser(updated);
	}
}
