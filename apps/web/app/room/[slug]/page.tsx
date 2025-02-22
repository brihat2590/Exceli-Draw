import axios from "axios";
import { BACKEND_URL } from "../../config";

async function getRoom(slug:any){
    const response=await axios.get(`${BACKEND_URL}/room/${slug}`)
    return (
        response.data.Id

    )


}
export default async function ChatRoom({params}:{
    params:{
        slug:string
    }
}){
    const slug=params.slug;
    const roomId=await getRoom(slug)



}