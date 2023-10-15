import { Request, Response } from "express";
import { prisma } from "../config/postgres/postgres";
import { IUserCreate, IUserLogin } from "../types/user.types";
import { validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis/cache";

const HashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

// Handle User registration
// @params: null
// @method: POST
// @route: /api/register
const CreateUser = async (req: Request, res: Response) => {
  const { name, email, password, role, company }: IUserCreate = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(406).json({
        message: "Invalid data",
        errors,
      });
    }
    let hashedPassword = await HashPassword(password);
    let date = new Date()
    const userData: Prisma.userCreateInput = {
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      company: company,
      createdAt: date,
    };

    const user = await prisma.user.create({
      data: userData,
    });
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error
    });
  }
};

// Handle User Authentication
// @body: email, password
// @method: POST
// @route: /api/authenticate
let AuthenticateUser = async (req: Request, res: Response) => {
  const { email, password }: IUserLogin = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(406).json({
        message: "Invalid Data",
        errors,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      user?.password || ""
    );



    if (!isPasswordMatching) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user?.id, userEmail: user?.email },
      process.env.JWT_SECRET || "default",
      { expiresIn: "1h" }
    );

    req.body.user = user

    res.status(200).json({
      message: "Authentication successful",
      token,
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Handle User registration
// @params: user
// @method: PATCH
// @route: /api/update/:id
let UpdateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(406).json({
        message: 'Invalid Data',
        errors,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { 
        id: Number(userId) 
      },
      data: req.body,
    });

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', "error": error });
  }
};

// Handle Deletion of User
// @params: id
// @method: DELETE
// @route: /api/users/:id
let DeleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id; // Assuming you have a route parameter for the user ID

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: Number(userId) },
    });

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Handle to retrieve User data
// @params: id
// @method: GET
// @route: /api/users/:id
let GetUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  let user;
  let isCached = false;

  try {
    const cacheResults = await redisClient.get(`user:${userId}`);
    if (cacheResults) {
      isCached = true;
      user = JSON.parse(cacheResults);
    } else {
      user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      if (user === null) {
        throw "API returned an empty array";
      }
      await redisClient.set(`user:${userId}`, JSON.stringify(user));
    }

    res.status(200).json({
      fromCache: isCached,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(401).json({
      message: "Internal server error: " + error,
    });
  }
};


export { 
    DeleteUser,
    CreateUser,
    AuthenticateUser,
    UpdateUser,
    GetUser
}