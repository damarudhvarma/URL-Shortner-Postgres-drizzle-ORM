
import { eq } from 'drizzle-orm';
import {db} from '../db/index.js'
import {randomBytes, createHmac} from "crypto";
import { usersTable } from '../models/user.model.js';
import { loginValidationSchema, signUpValidationSchema } from '../validations/req.validations.js';
import { hashPassword, verifyPassword } from '../utils/passwordsService.js';
import { generateToken } from '../utils/jwt.js';


export const signUp = async (req, res)=>{
 try

  {  const result= await signUpValidationSchema.safeParseAsync(req.body);
    if(result.error){
        return res.status(400).json({error : result.error.message});
    }

    const {firstName, lastName,email, password} = result.data;

    const [existingUser] = await db
     .select({
        id : usersTable.id
     }).from(usersTable)
     .where(eq(usersTable.email, email));

     if (existingUser){
        return res.status(400).json({message: "user with this email already exists!"})
     }
     const {salt , password: hashedPassword} = hashPassword(password);

        const [user] = await db.insert(usersTable).values({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            salt
        }).returning({id: usersTable.id});

     return res.status(201).json({message:"user created", user});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"internal server error"})
    }
}

export const login = async (req,res) =>{
   try { const result= await loginValidationSchema.safeParseAsync(req.body);
    if(result.error){
        return res.status(400).json({error : result.error.message});
    }

    const {email, password} = result.data;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email,email));

    if(!user){
        return res.status(400).json({message:"invalid email or password"});
    }

    const isPasswordValid = verifyPassword(password,user.salt,user.password);

    if(!isPasswordValid){
         return res.status(400).json({message:"invalid email or password"});
    }
    const token = generateToken({id:user.id});

    return res.status(200).json({message:"login successful",token});
}
    catch(err){
        console.log(err);
        return res.status(500).json({message:"internal server error"});
    }
} 