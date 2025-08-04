import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // ✅ Make sure this is imported
import { cn } from "@/lib/utils";

interface Proposal {
  id: string;
  title: string;
  notes: string;
  status: string;
  file_url: string;
  created_at: string;
}

interface ProposalListProps {
  proposals: Proposal[];
  className?: string;
}

export function ProposalListClient({ proposals, className }: ProposalListProps) {
  if (!proposals || proposals.length === 0) {
    return (
      <Card className={cn("p-6 text-center text-muted-foreground", className)}>
        <p>No proposals found.</p>
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

            {/* Right Section: Edit + Status + File */}
            <div className="ml-auto flex items-center gap-6">

              {/* Status */}
              <Badge variant="outline" className="capitalize text-sm">
                {proposal.status}
              </Badge>
              
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

              {/* File URL */}
              {/* <div className="w-28">
                {proposal.file_url ? (
                  <a
                    href={`/view-file/${proposal.id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs whitespace-nowrap block"
                  >
                    View File 2
                  </a>
                ) : (
                  <span className="text-gray-500 text-xs whitespace-nowrap block">
                    No file
                  </span>
                )}
              </div> */}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
