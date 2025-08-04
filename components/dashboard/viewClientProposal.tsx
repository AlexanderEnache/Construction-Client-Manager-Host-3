"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Proposal {
  id: string;
  title: string;
  notes: string;
  status: string;
  file_url: string;
  created_at: string;
}

interface ViewClientProposalsProps {
  proposals: Proposal[];
  className?: string;
}

export function ViewClientProposals({
  proposals,
  className,
}: ViewClientProposalsProps) {
  if (!proposals || proposals.length === 0) {
    return (
      <Card className={cn("p-6 text-center text-muted-foreground", className)}>
        <p>No proposals found for this client.</p>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
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
            <div className="w-1/4 truncate whitespace-nowrap text-sm font-medium">
              {proposal.title}
            </div>

            {/* Notes */}
            <div className="w-1/2 truncate whitespace-nowrap text-sm text-muted-foreground">
              {proposal.notes}
            </div>

            {/* Status & View File */}
            <div className="ml-auto flex items-center gap-10">
              <Badge variant="outline" className="capitalize text-sm">
                {proposal.status}
              </Badge>

              {proposal.file_url && (
                <a
                  href={proposal.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs whitespace-nowrap"
                >
                  View File
                </a>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
