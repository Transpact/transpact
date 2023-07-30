
import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { prisma } from "@/lib/utils"

export const generateToken = (userEmail:string,userId:string): string => {
    // Generate the JWT token with user data
    const expiresInDays = 2;
    const expirationTime = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;

    const token = jwt.sign({email:userEmail,id:userId,expirationTime}, process.env["SECRET_KEY"], { expiresIn: '1h' });
    return token;
};

export const verifyToken = (token:string|undefined,SECRET_KEY:string|undefined) => {

    try{

        const decodedToken = jwt.verify(token,SECRET_KEY);

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTimeInSeconds) {
            // Token has expired
            return undefined;
        }
        
        return decodedToken;
    }

    catch {
        return undefined;
    }
}


interface GetUser{
    email:string,
    id:string,
    expirationTime: number,
    iat: number,
    exp: number,

}

export async function getUser(req:NextApiRequest){

    let {token} = req.cookies;
    if (token===undefined){
        token = req.headers.authorization;
    }

    const userData:GetUser = verifyToken(token,process.env.SECRET_KEY);
    try{
        const user = await prisma.user.findFirst({
            where:{
                id: userData.id
            }
        });
        return user;
    }
    catch{
        return undefined;
    }
}

