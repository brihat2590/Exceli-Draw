import { URLSearchParams } from "url";
import jwt from "jsonwebtoken"
import { WebSocketServer,WebSocket } from "ws";
const prismaCli=require("@repo/db/prisma")

const JWT_SECRET=require("@repo/backend-common/secret")
console.log(JWT_SECRET)

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close()
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data:any) {
    let parsedData;
    try{
        if (typeof data !== "string") {
            parsedData = JSON.parse(data.toString());
          } else {
            parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
          }
    }
    catch(e:any){
        console.error("Invalid JSON received:", data);
        return;
    }

    if (parsedData.type === "join-room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave-room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.room);
    }

    console.log("message received")
    console.log(parsedData);

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

    //   await prismaClient.chat.create({
    //     data: {
    //       roomId: Number(roomId),
    //       message,
    //       userId
    //     }
    //   });
      await prismaCli.chat.create({
        data:{
          roomId:Number(roomId),
          message,
          userId
        }
      })

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })
    }

  });

});






