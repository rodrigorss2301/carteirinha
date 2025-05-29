import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { UserPayloadDto } from './dto/user-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly passwordHelper: PasswordHelper,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserPayloadDto | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    if (!password) {
      throw new NotFoundException(
        `Password not provided for user with username ${username}`,
      );
    }

    if (!user.password) {
      throw new NotFoundException(
        `User with username ${username} has no password set`,
      );
    }

    if (user && (await this.passwordHelper.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: SigninUserDto) {
    const payload = await this.validateUser(user.username, user.password);
    if (!payload) {
      throw new Error('Invalid username or password');
    }
    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }
}
