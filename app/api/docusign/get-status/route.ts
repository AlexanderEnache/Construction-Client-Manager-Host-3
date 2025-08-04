import { NextRequest, NextResponse } from "next/server";
import { getEnvelopeStatus } from "@/scripts/docusign/docusignStatus"; // Adjust the import path

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const envelopeId = searchParams.get("envelopeId");

    if (!envelopeId) {
      return NextResponse.json(
        { error: "Missing envelopeId query parameter" },
        { status: 400 }
      );
    }

    const status = await getEnvelopeStatus(envelopeId);

    return NextResponse.json({ status });
  } catch (error: any) {
    console.error("❌ Error fetching envelope status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get envelope status" },
      { status: 500 }
    );
  }
}
