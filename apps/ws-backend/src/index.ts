import { URLSearchParams } from "url";
import jwt from "jsonwebtoken"

const JWT_SECRET=require("@repo/backend-common/secret")
const{WebSockerServer}=require("ws");
const wss=new WebSockerServer({port:8080})

wss.on("connection",function connection(ws:any,request:any){
    const url=request.url;
    if(!url){
        return;
    }
    const queryParams=new URLSearchParams(url.split("?")[1]);
    const token=queryParams.get("token")||"";
    const decoded=




})


