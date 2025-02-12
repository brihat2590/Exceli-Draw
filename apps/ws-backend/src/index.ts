const JWT_SECRET=require("@repo/backend-common/secret")
const{WebSockerServer}=require("ws");
const wss=new WebSockerServer({port:8080})

wss.on("connection",function connection(ws,request){
    

    })

})
