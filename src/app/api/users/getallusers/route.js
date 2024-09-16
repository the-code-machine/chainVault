import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/db";
import User from "@/models/userModel";

connectDb();

export async function GET(request) {
    try {
        const users = await User.find({});
        return NextResponse.json({ data: users }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Getting error while fetching all users!" }, { status: 400 })
    }
}