import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PasswordHelper } from '../../shared/helpers/password.helper';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject()
    private readonly passwordHelper: PasswordHelper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { username, password, ...restOfDto } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await this.passwordHelper.hash(password);

    const user = this.userRepository.create({
      ...restOfDto,
      username,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    return UserResponseDto.fromEntity(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map(UserResponseDto.fromEntity);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserResponseDto.fromEntity(user);
  }

  async update(
    username: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findOne(username); // Ensures user exists and throws NotFoundException if not

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUserWithNewUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUserWithNewUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.passwordHelper.hash(
        updateUserDto.password,
      );
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(username: string): Promise<void> {
    const result = await this.userRepository.delete(username);
    if (result.affected === 0) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
  }
}
