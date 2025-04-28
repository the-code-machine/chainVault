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
      companyName,
      companyEmail,
    
    } = reqBody;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !companyName || !companyEmail) {
      return NextResponse.json({ 
        error: "Please provide all required fields" 
      }, { status: 400 });
    }

    // Check if user email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ 
        error: "User with this email already exists" 
      }, { status: 400 });
    }

    // Check if company name already exists
    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return NextResponse.json({ 
        error: "Company with this name already exists" 
      }, { status: 400 });
    }

    // Check if company email already exists
    const existingCompanyEmail = await Company.findOne({ email: companyEmail });
    if (existingCompanyEmail) {
      return NextResponse.json({ 
        error: "Company with this email already exists" 
      }, { status: 400 });
    }

    // Create new company
    const newCompany = new Company({
      name: companyName,
      email: companyEmail,
    
    });

    // Create new user (company admin)
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,

      role: 'admin',
      isCompanyAdmin: true
    });

    // Save the user first
    const savedUser = await newUser.save();

    // Set the admin field in the company and save
    newCompany.admin = savedUser._id;
    const savedCompany = await newCompany.save();

    // Update the user with the company ID
    savedUser.company = savedCompany._id;
    await savedUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie with the token
    const response = NextResponse.json({ 
      message: "Company and admin user registered successfully",
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        isCompanyAdmin: savedUser.isCompanyAdmin
      },
      company: {
        id: savedCompany._id,
        name: savedCompany.name,
        email: savedCompany.email
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
    console.error("Company registration error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}