"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PortfolioUpload({
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

    const fileName = `portfolio-${providerId}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("portfolio")
      .getPublicUrl(fileName);

    const { data: provider } = await supabase
      .from("videographers")
      .select(
        "portfolio_image1,portfolio_image2,portfolio_image3,portfolio_image4,portfolio_image5"
      )
      .eq("id", providerId)
      .single();

    let updateData: Record<string, string> = {};

    if (!provider?.portfolio_image1)
      updateData.portfolio_image1 = publicUrl;
    else if (!provider.portfolio_image2)
      updateData.portfolio_image2 = publicUrl;
    else if (!provider.portfolio_image3)
      updateData.portfolio_image3 = publicUrl;
    else if (!provider.portfolio_image4)
      updateData.portfolio_image4 = publicUrl;
    else if (!provider.portfolio_image5)
      updateData.portfolio_image5 = publicUrl;
    else {
      alert("Maximum 5 portfolio images allowed.");
      setUploading(false);
      return;
    }

    const { error } = await supabase
      .from("videographers")
      .update(updateData)
      .eq("id", providerId);

    setUploading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Portfolio image uploaded!");

    window.location.reload();
  }

  return (
    <div className="mt-8">
      <label className="block font-semibold mb-2">
        Upload Portfolio Image
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