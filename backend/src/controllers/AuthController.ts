import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sessionStore } from "../utils/sessionStore";
import { otpStore } from "../utils/otpStore";

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

  logout = async (req: Request, res: Response) => {
    const sessionId = req.cookies.auth_token;

    if(sessionId){
        sessionStore.delete(sessionId);
    }

    res.clearCookie('auth_token', {path: '/'});

    res.status(200).json({success: true, message: "Logout Successfull"});
  };

  forgotPassword = async (req:Request, res:Response) => {
    const {email} = req.body;

    const user = await this.userRepo.findOneBy({email});

    if(!user){
        return res.status(404).json({success:false, error:"No User with this email found."});
    }

    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn = (Date.now() + 5 * 60000);

    otpStore.set(email, {otp: mockCode, expires: expiresIn});

    res.status(200).json({success: true, message: "OTP sent successfully", code: mockCode});
  }

  resetPassword = async (req: Request, res: Response) => {
    const {code,email, password} = req.body;
    const {id} = (req as any).user;

    if(!code || !password){
        return res.status(400).json({success: false, error: "Please enter code or password"});
    }

    const storeCode = otpStore.get(email);
    if(storeCode.expires < Date.now()){
        otpStore.delete(email);
        return res.status(401).json({success: false, error: "OTP expired! Please try again"})
    }

    if(code !== storeCode.otp){
        return res.status(400).json({success: false, error: "OTP did not match"});
    }

    const user = await this.userRepo.findOne({
        where:({id})
    });

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await this.userRepo.save(user);

    return res.status(200).json({success: true, message: "Password Changed Successfully"});
  }
}

export const authController = new AuthController();
