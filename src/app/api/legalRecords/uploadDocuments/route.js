import { NextResponse } from "next/server";
import { getTokenURI, mintDocumentNFT } from "@/controllers/mint";
import Document from "@/models/documentModel";
import Activity from "@/models/activityLogs";


export const config = {
  api: {
    bodyParser: false, // Required when handling file uploads
  },
};

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");
 

    if (!file ) {
      return NextResponse.json({ error: "provide all the required fields" }, { status: 400 });
    }

    const timesatmp = Date.now()
    const documentId = file.name+timesatmp
    data.append("pinataMetadata", JSON.stringify({ name: documentId }));

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`, // Ensure your environment variable is set
      },
      body: data,
    });

    const { IpfsHash } = await res.json();

    return NextResponse.json(
      { ipfsHash: IpfsHash },
      { status: 200 }
    );
    
  } catch (e) {
    console.error("Error during POST:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenIdString = searchParams.get("tokenId");

  if (!tokenIdString || isNaN(parseInt(tokenIdString, 10))) {
    return NextResponse.json({ error: "Invalid Token ID" }, { status: 400 });
  }

  const tokenId = parseInt(tokenIdString, 10);

  try {
    const uri = await getTokenURI(tokenId);
    return NextResponse.json({ tokenUri: uri }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving token URI:", error);
    return NextResponse.json(
      { error: `Error retrieving token URI: ${error.message}` },
      { status: 500 }
    );
  }
}
