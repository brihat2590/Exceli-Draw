"use client"
import AuthPage from "../components/AuthPage";
import { useEffect } from "react";
import {useRouter} from "next/navigation"



export default function SignIn(){
    const router=useRouter();
    useEffect(()=>{
        
        const token=localStorage.getItem("token")
        if(token){
            router.push("/")
        }
    },[])
    
    return(
        <AuthPage isSignin={true}></AuthPage>
    )
}