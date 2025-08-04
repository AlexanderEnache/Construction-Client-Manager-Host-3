"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface EditProposalFormProps {
  proposalId: string;
}

export function EditProposalForm({ proposalId }: EditProposalFormProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newFileType, setNewFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFileChanged, setIsFileChanged] = useState(false);

  // Store original data for comparison
  const [originalData, setOriginalData] = useState<{
    title: string;
    notes: string;
    status: string;
    fileUrl: string | null;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProposal = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", proposalId)
        .single();

      if (error) {
        alert(`Failed to fetch proposal: ${error.message}`);
        return;
      }

      setTitle(data.title || "");
      setNotes(data.notes || "");
      setStatus(data.status || "");
      setFileUrl(data.file_url || null);
      setPreviewUrl(null);
      setNewFile(null);
      setNewFileType(null);
      setIsFileChanged(false);

      setOriginalData({
        title: data.title || "",
        notes: data.notes || "",
        status: data.status || "",
        fileUrl: data.file_url || null,
      });
    };

    fetchProposal();
  }, [proposalId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Helper to check if form data changed
  const isFormChanged = () => {
    if (!originalData) return false;
    if (title !== originalData.title) return true;
    if (notes !== originalData.notes) return true;
    if (status !== originalData.status) return true;
    if (isFileChanged) return true; // New file uploaded
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormChanged()) return; // Prevent submit if no changes

    setLoading(true);

    const supabase = createClient();
    let updatedFileUrl = fileUrl;

    if (newFile) {
      const filePath = `proposals/${Date.now()}-${newFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("proposal-files")
        .upload(filePath, newFile);

      if (uploadError) {
        alert(`File upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("proposal-files")
        .getPublicUrl(filePath);

      updatedFileUrl = publicUrlData.publicUrl;
    }

    const updateData: any = {
      title,
      notes,
      status,
    };

    if (newFile && updatedFileUrl) {
      updateData.file_url = updatedFileUrl;
    }

    const { error } = await supabase
      .from("proposals")
      .update(updateData)
      .eq("id", proposalId);

    setLoading(false);

    if (error) {
      console.error("Update error:", error);
      alert(`Update failed: ${error.message}`);
    } else {
      router.push("/view-clients");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <br />
      <h2 className="text-2xl font-semibold">Edit Proposal</h2>

      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        required
      />

      <Button
      type="submit"
      disabled={loading || !isFormChanged()}
      >
        {loading ? "Updating..." : "Update Proposal"}
      </Button>

      {(previewUrl || fileUrl) && (
        <div className="space-y-2">
          <div className="flex items-center">
            <Button
              asChild
              variant="outline"
              className="text-black bg-white border border-gray-300 hover:bg-gray-100"
              disabled={status === "Sent" && !isFileChanged}
            >
              <a
                href={`/view-file/${proposalId}`}
                rel="noopener noreferrer"
                style={{
                  pointerEvents:
                    status === "Sent" && !isFileChanged ? "none" : undefined,
                  opacity: status === "Sent" && !isFileChanged ? 0.6 : 1,
                }}
              >
                {status === "Sent" && !isFileChanged ? "Sent" : "Send DocuSign"}
              </a>
            </Button>

            <div className="flex-grow" /> {/* Pushes the Update button to the right */}
          </div>

          <br />

          {newFile ? (
            newFileType === "application/pdf" ? (
              <iframe
                src={previewUrl || ""}
                className="w-full h-64 border rounded"
                title="File Preview"
              />
            ) : (
              <img
                src={previewUrl || ""}
                alt="File Preview"
                className="max-w-full max-h-64 rounded border"
              />
            )
          ) : fileUrl?.endsWith(".pdf") ? (
            <iframe
              src={fileUrl}
              className="w-full h-64 border rounded"
              title="File Preview"
            />
          ) : (
            <img
              src={fileUrl || ""}
              alt="File Preview"
              className="max-w-full max-h-64 rounded border"
            />
          )}
        </div>
      )}

      <Input
        type="file"
        accept="application/pdf,image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setNewFile(file);

          if (file) {
            setNewFileType(file.type);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setIsFileChanged(true);
          } else {
            setPreviewUrl(null);
            setNewFileType(null);
            setIsFileChanged(false);
          }
        }}
      />
    </form>
  );
}
