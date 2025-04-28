import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDb } from "@/dbConnection/db";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDb();

          // Find user by email
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            return null;
          }
          
          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            return null;
          }
          
          // Update last login
          user.lastLogin = new Date();
          await user.save();
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            isCompanyAdmin: user.isCompanyAdmin,
            company: user.company ? user.company.toString() : null,
            ethreumAddress: user.ethreumAddress
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isCompanyAdmin = user.isCompanyAdmin;
        token.company = user.company;
        token.ethreumAddress = user.ethreumAddress;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isCompanyAdmin = token.isCompanyAdmin;
        session.user.company = token.company;
        session.user.ethreumAddress = token.ethreumAddress;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login', // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
};

// Helper function to get the current user server-side
export async function getCurrentUser(req) {
  try {
    const session = await getServerSession(req, authOptions);
    
    if (!session?.user?.id) {
      return null;
    }
    
    await connectDb();
    
    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return null;
    }
    
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isCompanyAdmin: user.isCompanyAdmin,
      company: user.company,
      ethreumAddress: user.ethreumAddress,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}