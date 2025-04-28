import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/db";
import User from "@/models/userModel";
import Company from "@/models/companyModel";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(request) {
  try {
    // Parse request body
    const reqBody = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      password,
      companyId,
      role = 'employee',  // Default rol
    } = reqBody;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ 
        error: "Please provide first name, last name, email and password" 
      }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ 
        error: "User with this email already exists" 
      }, { status: 400 });
    }


    // Check if company exists if companyId is provided
    let company = null;
    if (companyId) {
      company = await Company.findById(companyId);
      if (!company) {
        return NextResponse.json({ 
          error: "Company not found" 
        }, { status: 404 });
      }
    }

    // Create new user with required fields
    const newUserData = {
      firstName,
      lastName,
      email,
      password,
      role,
      company: companyId,
      isCompanyAdmin: false
    };
    

    const newUser = new User(newUserData);
    const savedUser = await newUser.save();
    

    // Create JWT token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie with the token
    const response = NextResponse.json({ 
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        company: savedUser.company,
      
      }
    });
    
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ 
      error: "Error registering user: " + (error.message || "Unknown error")
    }, { status: 500 });
  }
}