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
import { Role } from '../entities/role.type'; // Assuming CreateUserDto might not have role, and entity has default

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject()
    private readonly passwordHelper: PasswordHelper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role, ...restOfDto } = createUserDto;

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
      role: role || Role.PATIENT, // Ensure role is set, defaulting if necessary based on your DTO
    });

    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['patient'],
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Use findOne(id) to fetch the User entity by its ID

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

    // Use merge to apply partial updates correctly to the entity
    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  // It's generally better to remove by ID, but if username is the contract:
  async removeByUsername(username: string): Promise<void> {
    // First, find the user to ensure it exists and to trigger any listeners/subscribers if needed.
    const user = await this.findByUsername(username);
    // Then remove the found entity.
    // const result = await this.userRepository.remove(user);
    // Or, if you prefer to delete by criteria (less safe if username is not unique constraint for some reason):
    const result = await this.userRepository.delete({ username });
    if (result.affected === 0) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
  }
}
