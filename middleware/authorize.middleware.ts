import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { IDecode, IUserLogin } from "../types/user.types";

dotenv.config();

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let email: string;
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "jwt"
    ) {
      const token = req.headers.authorization!.split(" ")[1];
      let decode = jwt.verify(token, process.env.JWT_SECRET || "default") as IDecode;
      email = decode.userEmail
    }
    next();
  } catch (error) {
    req.body.user = undefined;
    return res.status(401).json({
      "message": "Unauthorize access to api."
    })
  }
};

export default authorize;
