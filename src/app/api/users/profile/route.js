import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/db";
import User from "@/models/userModel";
import Company from "@/models/companyModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken";

connectDb();

// GET user profile
export async function GET(request) {
  try {
    // Get user ID from session or JWT
    let userId;
    
    // Method 1: From NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      userId = session.user.id;
    }
    
    // Method 2: From JWT token (fallback)
    if (!userId) {
      const token = request.cookies.get("token")?.value;
      
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
          userId = decoded.id;
        } catch (err) {
          console.error("JWT verification failed:", err);
        }
      }
    }
    
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    // Find user with company details
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Get company details if user belongs to a company
    let companyDetails = null;
    if (user.company) {
      companyDetails = await Company.findById(user.company);
    }
    
    // Format response
    const userDetails = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      ethreumAddress: user.ethreumAddress,
      isCompanyAdmin: user.isCompanyAdmin,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      companyName: companyDetails?.name,
      companyId: companyDetails?._id,
      companyRole: user.role
    };
    
    return NextResponse.json(userDetails);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}