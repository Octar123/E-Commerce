import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sessionStore } from "../utils/sessionStore";

export class AuthController {
  private userRepo = AppDataSource.getRepository(User);

  register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const user = await this.userRepo.findOneBy({
      email,
    });

    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User Already Registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userData = this.userRepo.create({
      name,
      email,
      role: UserRole.USER,
      password: passwordHash,
    });

    await this.userRepo.save(userData);

    res
      .status(200)
      .json({ success: true, message: "User Registered Successfully" });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({success: false, error: "Please enter email and password"});
    }

    const user = await this.userRepo.findOne({
      where: {email},
      select: ["id","email", "name", "password", "role"]
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not Found" });
    }

    if (user.isLocked) {
      return res
        .status(400)
        .json({ success: false, error: "Account is Locked: Contact Admin" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Email or Password" });
    }

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({
        id: user.id,
        role: user.role
    }, secret, {
        expiresIn: '1d'
    });

    sessionStore.set(token, {id:user.id, role: user.role});

    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({success: true, message: "Login Successfull", name: user.name, role: user.role});
  };
}

export const authController = new AuthController();
