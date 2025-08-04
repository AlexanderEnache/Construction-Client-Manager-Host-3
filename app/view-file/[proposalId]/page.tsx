// app/view-file/[proposalId]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FilePreview from "@/components/filePreview";

type Params = Promise<{ proposalId: string }>

interface Proposal {
  id: string;
  file_url: string;
  title: string;
  clients: {
    name: string;
    email: string;
  }; // 👈 NOT an array!
}

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const proposalId = params.proposalId;

  const supabase = await createClient();

const { data: proposal, error } = await supabase
  .from("proposals")
  .select(`
    id,
    file_url,
    title,
    clients:client_id (
      name,
      email
    )
  `)
  .eq("id", proposalId)
  .single<Proposal>();

  if (error || !proposal) {
    console.error(error);
    return notFound();
  }

  console.log("INFORMATION " + proposal.clients?.email);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">{proposal.title}</h1>
      <FilePreview
        proposalId={proposalId}
        fileUrl={proposal.file_url}
        signerName={proposal.clients?.name ?? "Unknown"}
        signerEmail={proposal.clients?.email ?? "Unknown"}
        proposalTitle={proposal.title}
      />
    </div>
  );
}
