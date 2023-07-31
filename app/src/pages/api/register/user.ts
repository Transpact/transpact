import { NextApiRequest, NextApiResponse } from 'next';
import sha256 from 'js-sha256';
import { generateToken, getUser } from '@/lib/TokenAuth';
import { prisma } from "../index";


async function GET(req:NextApiRequest,res:NextApiResponse){

    const users = await prisma.user.findMany();

    return res.status(200).json(users);
}
async function POST(req:NextApiRequest,res:NextApiResponse){

    let email = req.body["email"];
    let password = sha256.sha256(req.body["password"]);

    try{
        const newUser = await prisma.user.create({
            data:{
                email,
                password
            }
        });
        const token = generateToken(newUser.email,newUser.id);

        return res.status(201).json({token});
    }

    catch (error:any) {
        return res.status(400).json({message:error.message})
    }


}


async function PUT(req:NextApiRequest,res:NextApiResponse){

    const user = await getUser(req);

    if (user===undefined){
        return res.status(401).json("INVALID TOKEN");
    }

    const data = req.body;

    try{
        await prisma.user.update({
            where:{
                id: user?.id
            },
            data:data
        });

        return res.status(200).json("USER UPDATED");
    }
    catch (err:any){
        return res.status(400).json(err.message);
    }

}



export default function handler(req:NextApiRequest,res:NextApiResponse){

    switch (req.method) {
        case 'GET':
            GET(req,res);
            break;
        case 'POST':
            POST(req,res);
            break;
        case 'PUT':
            PUT(req,res);
            break;
    }

}
