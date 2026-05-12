import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
}
