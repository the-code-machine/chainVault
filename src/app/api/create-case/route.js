import { connectDb } from "@/dbConnection/db";
import CaseModal from "@/models/caseModal";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

connectDb();

export async function POST(request) {
    try {
        // Parse the request body
        const reqBody = await request.json();
        const { caseNumber, title, courtName, stateName, date, ethreumAddress } = reqBody;
        console.log(ethreumAddress)
        // Validate required fields
        if (!caseNumber || !title || !courtName || !stateName || !ethreumAddress) {
            return NextResponse.json({ error: "Please fill all the required fields!" }, { status: 400 });
        }

        // Check if the user exists
        const user = await User.findOne({ ethreumAddress });
        if (!user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 400 });
        }

        // Create a new case
        const newCase = new CaseModal({
            caseNumber,
            title,
            courtName,
            stateName,
            userId: user._id.toString(), // Associate case with the user
        });

        // Save the new case
        await newCase.save();

        // Respond with success
        return NextResponse.json({
            message: "Case created successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error creating case:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
// GET endpoint: Fetch cases by ethreumAddress
export async function GET(request) {
    try {
        // Parse the query parameters
        const url = new URL(request.url);
        const ethreumAddress = url.searchParams.get('ethreumAddress');

        if (!ethreumAddress) {
            return NextResponse.json({ error: "ethreumAddress query parameter is required" }, { status: 400 });
        }

        // Find the user by ethreumAddress
        const user = await User.findOne({ ethreumAddress });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch cases associated with the userId
        const cases = await CaseModal.find({ userId: user._id.toString() });

        return NextResponse.json({
            message: "Cases retrieved successfully",
            cases,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching cases:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}