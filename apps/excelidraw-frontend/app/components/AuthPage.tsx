"use client"
import { BACKEND_URL } from "./config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router=useRouter();
  const[email,setEmail]=useState("")
  const[password,setPassword]=useState("");
    async function signUP(e:any){
      
      

    }
    async function signIN(e:any){
      


    }

   
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 m-4 rounded-2xl bg-white shadow-lg w-96 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>
        <input
          type="text"
          placeholder="Enter email"
          value={email}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=>{
            setEmail(e.target.value)
          }}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=>{
            setPassword(e.target.value)
          }}
        />
        <button
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          onClick={() => {
            {isSignin? signIN:signUP}
          }}
        >
          {isSignin ? "Sign In" : "Sign Up"}
        </button>
        <p className="text-gray-600 mt-4 text-sm">
          {isSignin ? "Don't have an account? " : "Already have an account? "}
          <Link href={isSignin ?'/signup':'/signin'} className="font-semibold hover:font-bold">
            {isSignin ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}