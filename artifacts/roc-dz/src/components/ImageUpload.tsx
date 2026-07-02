import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}

interface SignResponse {
  timestamp: number;
  signature: string;
  api_key: string;
  cloud_name: string;
  folder: string;
}

export function ImageUpload({ value, onChange, label = "image or video", accept = "image/*,video/*" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url) || url.includes("/video/");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      // Step 1 — get a server-side Cloudinary signature (tiny request, no file)
      const signRes = await fetch(`${BASE}/api/upload/sign`);
      if (!signRes.ok) throw new Error("Erreur de signature");
      const { timestamp, signature, api_key, cloud_name, folder } =
        await signRes.json() as SignResponse;

      // Step 2 — upload directly from browser to Cloudinary (bypasses Vercel limits)
      const resourceType = file.type.startsWith("video/") ? "video" : "image";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("api_key", api_key);
      formData.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
        { method: "POST", body: formData },
      );

      if (!uploadRes.ok) {
        const body = await uploadRes.json().catch(() => ({})) as { error?: { message?: string } };
        throw new Error(body?.error?.message ?? "Échec de l'upload");
      }

      const data = await uploadRes.json() as { secure_url: string };
      onChange(data.secure_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-white/10">
          {isVideo(value) ? (
            <video src={value} className="w-full h-40 object-cover" controls />
          ) : (
            <img src={value} alt="Preview" className="w-full h-40 object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Cliquer pour uploader {label}</span>
          <span className="text-xs text-muted-foreground/50">Images & vidéos · max 100 MB</span>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
      {uploading && <p className="text-xs text-primary animate-pulse">Upload en cours…</p>}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-xs"
      >
        {uploading ? "Upload en cours…" : value ? "Remplacer le fichier" : "Choisir un fichier"}
      </Button>
    </div>
  );
}
