import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  Logger,
  UseGuards,
} from '@nestjs/common';

import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('api/ideas')
export class IdeaController {
  private logger = new Logger('Idea Controller');

  constructor(private ideaService: IdeaService) { }

  private logData(options: any) {
    options.id && this.logger.log('IDEA ' + JSON.stringify(options.id));
    options.user && this.logger.log('USER ' + JSON.stringify(options.user));
    options.data && this.logger.log('DATA ' + JSON.stringify(options.data));
  }

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  createIdea(@User('id') user, @Body() data: IdeaDTO) {
    this.logData({ user, data })
    return this.ideaService.create(user, data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  updateIdea(@Param('id') id: string, @User('id') user, @Body() data: Partial<IdeaDTO>) {
    this.logData({ id, user, data })
    return this.ideaService.update(id, user, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteIdea(@Param('id') id: string, @User('id') user) {
    this.logData({ id, user })
    return this.ideaService.delete(id, user);
  }
}
