import { Controller, Post, Get, Body, UsePipes, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';

@Controller()
export class UserController {
    constructor(private userService: UserService) {

    }

    @Get('/api/users')
    @UseGuards(AuthGuard)
    showAllUsers() {
        return this.userService.showAll();
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() data: UserDto) {
        return this.userService.login(data);
    }

    @Post('register')
    @UsePipes(ValidationPipe)
    register(@Body() data: UserDto) {
        return this.userService.register(data);
    }
}
