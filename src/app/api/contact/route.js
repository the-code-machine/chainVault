import { connectDb } from "@/dbConnection/db";
import Contact from "@/models/contact";
import { NextResponse, NextRequest } from "next/server";

connectDb();

export async function POST(request){
    try{
        const reqBody = await request.json();
        const { firstName, lastName, email, phone, message } = reqBody;

        if(!firstName || !lastName || !email || !phone || !message){
            return NextResponse.json({error: "Please fill all the required fields first!"});
        }

        //check if contact already exist or not based on email
        let contact = await Contact.findOne({email});
        
        if(contact){
            return NextResponse.json({error: "Contact with this email already exists"}, {status: 400})
        }

         //create new contact
         const newContact = new Contact({
            firstName,
            lastName,
            email,
            phone,
            message
         })

         //save the contact
         const savedContact = await newContact.save();

         return NextResponse.json({
            message: "Contact created Successfully",
            success: true,
         })
    }

    catch(error){
        console.error("Error creating contact:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
    
}