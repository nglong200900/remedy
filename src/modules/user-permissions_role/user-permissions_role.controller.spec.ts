import { Test, TestingModule } from '@nestjs/testing';
import { UserPermissionsRoleController } from './user-permissions_role.controller';
import { UserPermissionsRoleService } from './user-permissions_role.service';

describe('UserPermissionsRoleController', () => {
  let controller: UserPermissionsRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPermissionsRoleController],
      providers: [UserPermissionsRoleService],
    }).compile();

    controller = module.get<UserPermissionsRoleController>(
      UserPermissionsRoleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
