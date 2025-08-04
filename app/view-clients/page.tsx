import { createClient } from "@/lib/supabase/server";
import { ClientList } from "@/components/dashboard/clientList";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-red-500 p-6">
        Failed to load clients: {error.message}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-start justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <ClientList clients={clients ?? []} />
      </div>
    </div>
  );
}
