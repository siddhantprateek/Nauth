interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    company: string;
    role: string;
    createdAt: Date;
}

namespace Express {
    interface Request {
        user: IUser;
    }
}
  