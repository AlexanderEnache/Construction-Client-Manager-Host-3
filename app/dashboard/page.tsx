import { ProposalList } from "@/components/dashboard/proposalList";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function Page() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return <div className="text-red-500">User not authenticated</div>;
  }

  // Fetch clients owned by user
  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .select("id, name")
    .eq("user_id", user.id);

  if (clientsError) {
    return <div className="text-red-500">Failed to load clients: {clientsError.message}</div>;
  }

  const clientIds = clients?.map((c) => c.id) ?? [];

  if (clientIds.length === 0) {
    return (
      <Card className="rounded-xl border bg-card shadow p-6 text-center text-muted-foreground">
          <p>No proposals (no clients assigned)</p>
      </Card>
    );
  }

  // Fetch proposals filtered by client IDs
  const { data: proposals, error: proposalsError } = await supabase
    .from("proposals")
    .select("id, title, notes, status, file_url, created_at, client_id")
    .in("client_id", clientIds)
    .order("created_at", { ascending: false });

  if (proposalsError) {
    return <div className="text-red-500">Failed to load proposals: {proposalsError.message}</div>;
  }

  // Attach client info to each proposal
  const proposalsWithClient = proposals.map((p) => ({
    ...p,
    client: clients.find((c) => c.id === p.client_id) ?? { id: "", name: "Unknown Client" },
  }));

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-5xl">
        <ProposalList proposals={proposalsWithClient} />
      </div>
    </div>
  );
}
