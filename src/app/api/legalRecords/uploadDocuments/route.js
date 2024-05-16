import { NextResponse } from "next/server";


export default {
  api: {
    bodyParser: false,
  },
}

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

