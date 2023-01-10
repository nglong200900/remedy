import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
  };
}

export default RequestWithUser;
