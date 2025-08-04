"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function AddClientForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("You must be logged in to add a client.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("clients").insert([
      {
        name,
        email,
        user_id: user.id,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(`Failed to add client: ${error.message}`);
    } else {
      router.push("/view-clients"); // or wherever your client list is
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold">Add New Client</h2>

      <Input
        type="text"
        placeholder="Client Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        type="email"
        placeholder="Client Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Client"}
      </Button>
    </form>
  );
}
