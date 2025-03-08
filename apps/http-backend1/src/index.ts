
const{createuserSchema,roomSchema,signInSchema} =require("@repo/common/common")
const JWT_SECRET=require("@repo/backend-common/secret");
const prismaCli=require("@repo/db/prisma")
const bcrypt=require("bcrypt")

import { middleware } from "./midleware";
import express  from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
const app=express();
app.use(cors());
app.use(express.json());
app.post("/signup",async(req,res)=>{
    const{email,password,name}=req.body;
    if(!email || !password || !name){
        res.json({
            message:"all feilds are required"
        })
    }
    
    const parsedData=createuserSchema.safeParse(req.body);
    if(parsedData.error){
        res.json({
            message:parsedData.error
        })
    }
    try{
        const hashedPassword=await bcrypt.hash(password,5)
        const user=await prismaCli.user.create({
            data:{
                email,
                password:hashedPassword,
                name
            }
        })
        res.json({
            message:"youve sucessfuly signed up"
        })
    }
    catch(e){
        res.json({
            message:"the user already exists"
        })
    }
    
   

    

    
})
app.post("/signin",async(req,res)=>{
    const{email,password}=req.body;
    const parsedData=signInSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message:parsedData.error.erros
        })

    }
    try{
        
        const user=await prismaCli.user.findFirst({
            where:{email:email}
        })
        if(!user){
            res.json({
                message:"the user does not exists"
            })
        }
        const passwordMatch=await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            res.status(404).send({
                message:"the password does not match "
            })
        }
        else{
            const token=jwt.sign({
                userId:user.id
            },JWT_SECRET)
            res.json({
                token:token
            })
        }
        
        
    }
    catch(e){
        console.log(e)
        res.json({
            message:"internal server error"
        })
    }
})
app.post("/create-room",middleware,async(req,res)=>{
    const{name}=req.body;
    const parsedData=roomSchema.safeParse(req.body);
    if(parsedData.error){
        res.json({
            message:parsedData.error
        })
        return;
    }
    else{
        
        const userId=req.userId;
        try{
            const room= await prismaCli.room.create({
                data:{
                    slug:name,
                    adminId:userId

                }
            })
            res.json({
                message:"the room is successfully created",
                roomId:room.id
            })
        }
        catch(e){
            res.json({
                message:"room already exists with this name bud"
            })

        }


    }

})
app.get("/chats/:roomId",async(req,res)=>{
    const roomId=Number(req.params.roomId);
    const messages=await prismaCli.chat.findMany({
        where:{
            id:roomId
        },
        orderBy:{
            id:"desc"
        },
        take:50
    })
    res.json({
        messages
    })

})
app.get("/room/:slug",async(req,res)=>{
    const slug=req.params.slug;
    const room=await prismaCli.room.findFirst({
        where:{
            slug:slug
        }

    })
    res.json({
        message:"the room if found",
        room:room
    })
})









app.listen(3002,()=>{
    console.log("listening on port 3000")
})

