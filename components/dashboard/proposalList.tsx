"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // ✅ Make sure this is imported


interface Proposal {
  id: string;
  title: string;
  notes: string;
  status: string;
  file_url: string;
  created_at: string;
  client_id: string;      // <-- Add this
  client: {
    id: string,
    name: string
  }
}

interface ProposalListProps {
  proposals: Proposal[];
  className?: string;
}

export function ProposalList({ proposals, className }: ProposalListProps) {
  if (!proposals || proposals.length === 0) {
    return (
      <Card className={cn("p-6 text-center text-muted-foreground", className)}>
        <p>No proposals found.</p>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-3xl font-semibold">All Proposals</h1>
      <br/>
      {proposals.map((proposal, index) => (
        <Card
          key={proposal.id}
          className={cn(
            "border-b border-border px-4 py-2 rounded-none",
            index === proposals.length - 1 && "border-b-0"
          )}
        >
          <div className="flex flex-row items-center gap-4 w-full overflow-hidden">
            {/* Title */}
            <div className="w-1/5 truncate whitespace-nowrap text-sm font-medium">
              {proposal.title}
            </div>

            {/* Notes */}
            <div className="w-2/5 truncate whitespace-nowrap text-sm text-muted-foreground">
              {proposal.notes}
            </div>

            {/* Client Name */}
            <div className="w-1/5 truncate whitespace-nowrap text-sm text-blue-600 hover:underline">
              <a href={`/view-client-proposals/${proposal.client_id}`}>
                {proposal.client.name}
              </a>
            </div>

            {/* Status + View */}
            <div className="ml-auto flex items-center gap-6">
              <Badge
                  variant="outline"
                  className="capitalize text-sm min-w-[80px] text-center justify-center"
                >
                {proposal.status}
              </Badge>

              <div className="w-24 text-xs whitespace-nowrap">
                {/* ✅ Edit Button */}
                <Link href={`/edit-proposals/${proposal.id}`}>
                  <Button
                  size="sm"
                  variant="outline"
                  className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                  >
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
