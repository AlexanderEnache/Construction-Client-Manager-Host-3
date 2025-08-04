// app/api/docusign-webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DOMParser } from 'xmldom';

export async function POST(req: NextRequest) {
  const xml = await req.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');

  try {
    const envelopeId = xmlDoc.getElementsByTagName('EnvelopeID')[0]?.textContent;
    const status = xmlDoc.getElementsByTagName('Status')[0]?.textContent;

    if (!envelopeId || !status) {
      return new NextResponse('Missing envelopeId or status', { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('docusign_id', envelopeId);

    if (error) {
      console.error('Supabase update failed:', error);
      return new NextResponse('Database update failed', { status: 500 });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook parsing error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
