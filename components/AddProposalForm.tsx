"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface AddProposalFormProps {
  clientId: string;
  clientName: string;
}

export function AddProposalForm({ clientId, clientName }: AddProposalFormProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("No File");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("User not authenticated.");
      setLoading(false);
      return;
    }

    let uploadedFileUrl: string | null = null;

    if (file) {
      const filePath = `proposals/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("proposal-files")
        .upload(filePath, file);

      if (uploadError) {
        alert(`File upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("proposal-files")
        .getPublicUrl(filePath);

      uploadedFileUrl = publicUrlData.publicUrl;
      setStatus("Drafted");
    }

    const { data, error } = await supabase
      .from("proposals")
      .insert([
        {
          title,
          notes,
          status,
          file_url: uploadedFileUrl,
          client_id: clientId,
          user_id: user.id,
        },
      ])
      .select()
      .single(); // This ensures you get a single object instead of an array

    setLoading(false);

    if (error || !data) {
      alert(`Failed to add proposal: ${error?.message || "Unknown error"}`);
    } else {
      const proposalId = data.id;
      if (file) {
        router.push(`/view-file/${proposalId}`);
      } else {
        router.push(`/view-client-proposals/${clientId}`);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
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

      <div>
        <label className="text-sm font-medium block mb-1">Upload File (optional)</label>
        <Input
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
        />
      </div>

      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm mb-2 text-muted-foreground">Preview:</p>
          {file?.type.startsWith("image/") ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 border rounded object-contain"
            />
          ) : file?.type === "application/pdf" ? (
            <iframe
              src={previewUrl}
              className="w-full h-64 border rounded"
              title="PDF Preview"
            ></iframe>
          ) : (
            <p className="text-red-500 text-sm">Preview not available for this file type.</p>
          )}
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Proposal"}
      </Button>
    </form>
  );
}
