import { createClient } from "@/lib/supabase/server";
import { AddProposalForm } from "@/components/AddProposalForm";
import { notFound } from "next/navigation";

type Params = Promise<{ clientId: string }>

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const clientId = params.clientId;

  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .select("name")
    .eq("id", clientId)
    .single();

  if (error || !client) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <br/>
      <h1 className="text-3xl font-semibold mb-4">
        Add proposal for client: <span className="text-primary">{client.name}</span>
      </h1>
      <br/>
      <AddProposalForm clientId={params.clientId} clientName={client.name} />
    </div>
  );
}
