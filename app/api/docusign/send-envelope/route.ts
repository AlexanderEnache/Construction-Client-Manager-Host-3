export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { signerEmail, signerName, fileUrl, proposalTitle } = body;

    if (!signerEmail || !signerName || !fileUrl || !proposalTitle) {
      return NextResponse.json(
        { error: "Missing required parameters at Route" },
        { status: 400 }
      );
    }

    const { sendEnvelope } = await import("../../../../scripts/docusign/sendEnvelope.js");

    // Pass parameters to sendEnvelope (adjust order if needed)
    // await sendEnvelope(signerName, signerEmail, fileUrl, proposalTitle);

    const result = await sendEnvelope(signerName, signerEmail, fileUrl, proposalTitle);

    // Log the envelopeId from the result
    console.log("Envelope ID HERE:", result.envelopeId);

    return NextResponse.json({ success: true, envelopeId: result.envelopeId });
  } catch (error) {
    console.error("❌ DocuSign Error:", error);
    return NextResponse.json({ error: "Failed to send envelope" }, { status: 500 });
  }
}
