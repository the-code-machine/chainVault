import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/db";
import User from "@/models/userModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

connectDb();

// This API endpoint allows users to connect their Ethereum address after login
export async function POST(request) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    // Parse request body
    const reqBody = await request.json();
    const { ethreumAddress } = reqBody;
    
    if (!ethreumAddress) {
      return NextResponse.json({ error: "Ethereum address is required" }, { status: 400 });
    }
    
    // Check if this Ethereum address is already in use
    const existingUser = await User.findOne({ ethreumAddress });
    if (existingUser && existingUser._id.toString() !== session.user.id) {
      return NextResponse.json({ 
        error: "This Ethereum address is already linked to another account" 
      }, { status: 400 });
    }
    
    // Find the current user by ID
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Update the user's Ethereum address
    user.ethreumAddress = ethreumAddress;
    await user.save();
    
    // If user is a company admin, update the company's Ethereum address too
    if (user.isCompanyAdmin && user.company) {
      const Company = mongoose.models.companies || mongoose.model("companies");
      const company = await Company.findById(user.company);
      if (company) {
        company.ethreumAddress = ethreumAddress;
        await company.save();
      }
    }
    
    return NextResponse.json({ 
      message: "Ethereum address updated successfully",
      ethreumAddress
    });
  } catch (error) {
    console.error("Error updating Ethereum address:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}