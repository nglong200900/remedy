import { Test, TestingModule } from '@nestjs/testing';
import { UserPermissionsRoleService } from './user-permissions_role.service';

describe('UserPermissionsRoleService', () => {
  let service: UserPermissionsRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPermissionsRoleService],
    }).compile();

    service = module.get<UserPermissionsRoleService>(
      UserPermissionsRoleService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
