import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/db";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(request) {
  try {
    // Parse request body
    const reqBody = await request.json();
    const { email, password, ethreumAddress } = reqBody;
    
    // Check if login is using email or Ethereum address
    let user;
    
    if (email && password) {
      // Email/password login
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }
      
      // Find user by email
      user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      
      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    } else if (ethreumAddress) {
      // Ethereum login - only used after initial registration
      user = await User.findOne({ ethreumAddress });
      
      if (!user) {
        return NextResponse.json({ error: "No account found with this Ethereum address" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Invalid login method" }, { status: 400 });
    }
    
    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
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
        company: user.company,
        ethreumAddress: user.ethreumAddress,
        isCompanyAdmin: user.isCompanyAdmin
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}