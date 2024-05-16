import { connectDb } from "@/dbConnection/db";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";

connectDb();

export async function POST(request){
    try{
        const reqBody = await request.json();
        const {ethreumAddress, name} = reqBody;

        if(!ethreumAddress || !name){
            return NextResponse.json({error: "Please fill all the required fields first!"});
        }

        //check if user already exist or not based on email
        let user = await User.findOne({ethreumAddress});
        
        if(user){
            return NextResponse.json({error: "User with this wallet already exists"}, {status: 400})
        }

         //create new user
         const newUser = new User({
            ethreumAddress,
            name,
            
         })

         //save the user
         const savedUser = await newUser.save();

         return NextResponse.json({
            message: "User created Successfully",
            success: true,
          
         })
    }

    catch(error){
        console.error("Error creating user:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
    
}