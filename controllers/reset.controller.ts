import { Request, Response } from "express";
import { prisma } from "../config/postgres/postgres";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";
import Joi from "joi";
import { Prisma } from "@prisma/client";
import { token } from "morgan";

interface IRequestReset {
  email: string;
}

const requestPasswordReset = async (req: Request, res: Response) => {
  let { email }: IRequestReset = req.body;
  try {
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
  } catch (err) {
    res.status(500).json({"Error": err});
  }
};

const HashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

const PasswordResetHandler = async (req: Request, res: Response) => {
  let { email }: IRequestReset = req.body;

  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "user with given email doesn't exist",
      });
    }

    let token = await prisma.token.findUnique({
      where: {
        id: 1,
      },
    });

    if (token === null) {
      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(resetToken, Number(10));

      let date = new Date();
      const tokenData: Prisma.tokenCreateInput = {
        token: hash,
        createdAt: date,
        expiresIn: 3600,
      };
      token = await prisma.token.create({
        data: tokenData,
      });
    }

    const link = `${process.env.BASE_URL}/api/confirm-reset/tokenId=${token.id}&token=${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.status(201).send({
      message: "password reset link sent to your email account",
      link: link,
    });
  } catch (error) {
    res.status(401).json({ message: "An error occured: " + error });
  }
};

interface INewPassword {
  id: number;
  accessToken: string;
  password: string;
  confirmPassword: string;
}

const RequestTokenHandler = async (req: Request, res: Response) => {
  let { id, accessToken, password, confirmPassword }: INewPassword = req.body;
  try {

    const schema = Joi.object({ 
			id: Joi.number().required(),
			accessToken: Joi.string().required(),
			password: Joi.string().required(),
			confirmPassword: Joi.string().required()
		});
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(400).send({ message: "invalid link or expired" });
    }

    const token = await prisma.token.findUnique({
      where: {
        id: user.id,
        token: accessToken,
      },
    });

    if (!token) {
      return res.status(400).send({
        message: "Invalid link or expired",
      });
    }
		let hashedPassword = await HashPassword(password);
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(201).send({
      message: "password reset sucessfully.",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ 
			"message": "Internal Server error"+ error,
		});
  }
};

export { PasswordResetHandler, RequestTokenHandler };
