"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfileImageUpload({
  providerId,
}: {
  providerId: number;
}) {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const fileName = `${providerId}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("profiles")
      .getPublicUrl(fileName);

    const { error } = await supabase
      .from("videographers")
      .update({
        profile_image: publicUrl,
      })
      .eq("id", providerId);

    setUploading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile photo updated!");

    window.location.reload();
  }

  return (
    <div className="mt-6">
      <label className="block font-semibold mb-2">
        Change Profile Photo
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
        className="block w-full rounded-lg border p-2"
      />

      {uploading && (
        <p className="mt-2 text-blue-600">
          Uploading...
        </p>
      )}
    </div>
  );
}