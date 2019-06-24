import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserDto, UserRo } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    async showAll(): Promise<UserRo[]> {
        const users = await this.userRepository.find({ relations: ['ideas'] });
        return users.map(user => user.toResponseObject(false));
    }
    async login(data: UserDto) {
        const { username, password } = data;
        const user = await this.userRepository
            .createQueryBuilder()
            .where('UserEntity.username = :username', { username })
            .addSelect('UserEntity.password')
            .getOne();

        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException(
                'Invalid username/password',
                HttpStatus.FORBIDDEN
            )
        }

        return user.toResponseObject();
    }
    async register(data: UserDto) {
        const { username } = data;
        let user = await this.userRepository.findOne({ where: { username } });
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject();
    }

}
