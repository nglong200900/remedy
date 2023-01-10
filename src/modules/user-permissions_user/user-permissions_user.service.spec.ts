import { Test, TestingModule } from '@nestjs/testing';
import { UserPermissionsUserService } from './user-permissions_user.service';

describe('UserPermissionsUserService', () => {
  let service: UserPermissionsUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPermissionsUserService],
    }).compile();

    service = module.get<UserPermissionsUserService>(
      UserPermissionsUserService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
