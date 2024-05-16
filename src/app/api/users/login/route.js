// Backend (Node.js - Express)

// This is a simplified version of how you might handle MetaMask authentication on the backend
// You might need to adjust it based on your actual backend architecture

import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/db";
import User from "@/models/userModel";

connectDb();

export async function POST(request) {
  try {
    // Parse request body
    const reqBody = await request.json();
    const { ethreumAddress} = reqBody;
    if(!ethreumAddress){
        return NextResponse.json({error: "Please fill all the required fields first!"});
    }

    //check if user already exist or not based on email
    let user = await User.findOne({ethreumAddress});

     if(!user){
        return NextResponse.json({error: "User not exists!"})
     }

    // Create session or token and send response
    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
