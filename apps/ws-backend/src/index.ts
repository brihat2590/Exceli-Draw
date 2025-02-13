import { URLSearchParams } from "url";
import jwt from "jsonwebtoken"

const JWT_SECRET=require("@repo/backend-common/secret")
const{WebSockerServer}=require("ws");
const wss=new WebSockerServer({port:8080})

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
  }
  const users:User[]=[];
  function checkUser(token:string): string | null{
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        if(typeof decoded==="string"){
            return null;
        }
        if(!decoded || !decoded.userId){
            return null;
        }
        return decoded.userId;
    }
    catch(e){
        return null;
    }
    return null;
  }

wss.on("connection",function connection(ws:any,request:any){
    const url=request.url;
    if(!url){
        return;
    }
    const queryParams=new URLSearchParams(url.split("?")[1]);
    const token=queryParams.get("token")||"";
    const decoded=jwt.verify(token,JWT_SECRET)
    const userId=checkUser(token);
    if(typeof decoded=="string"){
        ws.close();
        return

    }
    if(!decoded||!decoded.userId){
        ws.close();
        return;
    }

    ws.on("connection",function message(data:any){
        ws.send("pong")
        console.log(data)
    })




})


