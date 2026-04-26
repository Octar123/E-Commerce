import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcrypt";

export class AuthController {
    private userRepo = AppDataSource.getRepository(User);
    
    register = async (req:Request, res: Response) => {
        const {name, email, password} = req.body;
    
        const user = await this.userRepo.findOneBy({
            email
        });
    
        if(user){
            return res.status(400).json({success: false, error: "User Already Registered."});
        }
    
        const passwordHash = await bcrypt.hash(password, 10);
    
        const userData = this.userRepo.create({
            name, email, role: UserRole.USER, password: passwordHash
        });
    
        await this.userRepo.save(userData);
    
        res.status(200).json({success: true, message:"User Registered Successfully", userData});
    }
}

export const authController = new AuthController();