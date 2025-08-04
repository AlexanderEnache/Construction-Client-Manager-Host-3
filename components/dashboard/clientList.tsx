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
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* <Card className={"p-6 text-center text-muted-foreground"}>
        <p>You have no clients</p>
      </Card> */}

      <Link href={`/add-client/`}>
        <Button>Click to add Clients</Button>
      </Link>
    </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-semibold">My Clients</h1>
      <Link href={`/add-client/`}>
        <Button>Add Client</Button>
      </Link>
    </div>
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
