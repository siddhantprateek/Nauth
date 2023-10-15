interface IUserCreate {
  email: string;
  name: string;
  password: string;
  role: string;
  company: string;
}

interface IDecode {
    userId: number;
    userEmail: string;
    iat: number;
    exp: number;
}

interface IUserLogin {
  email: string;
  password: string;
}

export { IUserCreate, IUserLogin, IDecode };
