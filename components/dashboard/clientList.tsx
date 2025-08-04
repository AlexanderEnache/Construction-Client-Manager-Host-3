"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  created_at: string;
  proposals?: { count: number };
}

interface ClientListProps {
  clients: Client[];
  className?: string;
}

export function ClientList({ clients, className }: ClientListProps) {
  if (!clients || clients.length === 0) {
    return (
      <Card className={cn("p-6 text-center text-muted-foreground", className)}>
        <p>No clients found.</p>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-3xl font-semibold">My Clients</h1>
      <br/>
      {clients.map((client, index) => (
        <Card
          key={client.id}
          className={cn(
            "border-b border-border px-4 py-2 rounded-none",
            index === clients.length - 1 && "border-b-0"
          )}
        >
          <div className="flex items-center justify-between w-full gap-4 overflow-hidden">
            {/* Left side: Name and Email */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 truncate">
              <span className="text-sm font-medium truncate">{client.name}</span>
              <span className="text-sm text-muted-foreground truncate">{client.email}</span>
            </div>

            {/* Right side: Proposal count + buttons */}
            <div className="flex items-center gap-4">
              {/* <span className="text-sm text-muted-foreground whitespace-nowrap">
                {client.proposals?.count ?? 0} proposal{(client.proposals?.count ?? 0) === 1 ? "" : "s"}
              </span> */}

              {/* View Button */}
              <Link href={`/view-client-proposals/${client.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>

              {/* Add Proposal Button */}
              <Link href={`/add-proposal/${client.id}`}>
                <Button size="sm">Add Proposal</Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
