import { Test, TestingModule } from '@nestjs/testing';
import { UserPermissionsUserController } from './user-permissions_user.controller';
import { UserPermissionsUserService } from './user-permissions_user.service';

describe('UserPermissionsUserController', () => {
  let controller: UserPermissionsUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPermissionsUserController],
      providers: [UserPermissionsUserService],
    }).compile();

    controller = module.get<UserPermissionsUserController>(
      UserPermissionsUserController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
