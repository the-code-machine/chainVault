import Document from "@/models/documentModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = await request.json();
        const documents = await Document.find({ modifypermissions: { $in: [userId] } });

        if (documents.length === 0) {
            return NextResponse.json({ message: "No documents found for the user" }, { status: 404 });
        }

        return NextResponse.json(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}
