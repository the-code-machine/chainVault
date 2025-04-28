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
    const { email, password, ethreumAddress } = reqBody;
    
    // Check if login is using email or Ethereum address
    let user;
    let company;
    
    if (email && password) {
      // Email/password login - find the company by email first
      company = await Company.findOne({ email });
      
      if (!company) {
        return NextResponse.json({ error: "No company found with this email" }, { status: 401 });
      }
      
      // Find the company admin
      user = await User.findOne({ 
        company: company._id,
        isCompanyAdmin: true
      }).select('+password');
      
      if (!user) {
        return NextResponse.json({ error: "Company admin account not found" }, { status: 401 });
      }
      
      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    } else if (ethreumAddress) {
      // Ethereum login - only used after initial registration
      company = await Company.findOne({ ethreumAddress });
      
      if (!company) {
        return NextResponse.json({ error: "No company found with this Ethereum address" }, { status: 401 });
      }
      
      // Find the company admin
      user = await User.findOne({ 
        company: company._id,
        isCompanyAdmin: true
      });
      
      if (!user) {
        return NextResponse.json({ error: "Company admin account not found" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Invalid login method" }, { status: 400 });
    }
    
    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        companyId: company._id 
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );
    
    // Set HTTP-only cookie with the token
    const response = NextResponse.json({ 
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isCompanyAdmin: user.isCompanyAdmin,
        ethreumAddress: user.ethreumAddress
      },
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        ethreumAddress: company.ethreumAddress,
        plan: company.plan,
        storagePercentage: company.storagePercentage
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
    console.error("Company login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}