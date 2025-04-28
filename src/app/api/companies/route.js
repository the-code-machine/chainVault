import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/db";
import Company from "@/models/companyModel";

connectDb();

// API endpoint to get all active companies for registration dropdown
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    // Create search filter
    const filter = {
      isActive: true, // Only return active companies
    };
    
    // Add search term if provided
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }
    
    // Fetch companies with pagination
    const companies = await Company.find(filter)
      .select('name email') // Only return necessary fields
      .sort({ name: 1 }) // Sort alphabetically
      .limit(50); // Limit to 50 results
    
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// API endpoint to check if a company name or email is available
export async function POST(request) {
  try {
    const { name, email } = await request.json();
    
    // Create response object
    const result = { available: true, message: "" };
    
    // Check name availability if provided
    if (name) {
      const existingName = await Company.findOne({ name });
      if (existingName) {
        result.available = false;
        result.message = "Company name already exists";
      }
    }
    
    // Check email availability if provided
    if (email && result.available) {
      const existingEmail = await Company.findOne({ email });
      if (existingEmail) {
        result.available = false;
        result.message = "Company email already exists";
      }
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking company availability:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}