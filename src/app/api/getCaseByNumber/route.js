// pages/api/getCaseByNumber.js
import { connectDb } from "@/dbConnection/db";
import CaseModal from "@/models/caseModal";
import { NextResponse } from "next/server";

connectDb();

export async function GET(request) {
    try {
        // Get the case number from the query parameters
        const { searchParams } = new URL(request.url);
        const caseNumber = searchParams.get('caseNumber');

        // Validate case number
        if (!caseNumber) {
            return NextResponse.json({ error: "Case number is required" }, { status: 400 });
        }

        // Fetch case information from the database
        const caseInfo = await CaseModal.findOne({ caseNumber });
        if (!caseInfo) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        // Respond with case information
        return NextResponse.json(caseInfo);
    } catch (error) {
        console.error("Error fetching case information:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
