import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the authentication cookie
    const cookieStore = cookies();
    
    // Clear JWT token cookie
    cookieStore.delete({
      name: "token",
      path: "/",
    });
    
    // Clear NextAuth session cookie if exists
    cookieStore.delete({
      name: "next-auth.session-token",
      path: "/",
    });
    
    // Create response
    const response = NextResponse.json({ 
      success: true,
      message: "Logged out successfully" 
    });
    
    // Ensure all cookies are cleared in the response
    response.cookies.delete("token");
    response.cookies.delete("next-auth.session-token");
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Error during logout" 
    }, { status: 500 });
  }
}