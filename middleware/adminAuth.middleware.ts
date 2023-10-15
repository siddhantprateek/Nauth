import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/postgres/postgres";
import jwt from "jsonwebtoken";
import { IDecode } from "../types/user.types";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
 
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

      let user = await prisma.user.findUnique({
        where: {
          email
        }
      })

      let userRole = user?.role
      if (userRole === "admin") {
        next();
      } else {
        // User does not have admin role,
        // deny access with a 403 Forbidden response
        res.status(403).json({
          message: "Access denied: You must be an admin privilages to access this resource",
        });
      }
    }
  } catch (error) {
    return res.status(401).json({
      "message": "Access denied: You must be an admin privilages to access this resource"
    })
  }
};

export default isAdmin;
