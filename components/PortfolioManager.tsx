"use client";

import { supabase } from "@/lib/supabase";

export default function PortfolioManager({
  provider,
}: {
  provider: any;
}) {
  const images = [
    {
      key: "portfolio_image1",
      url: provider.portfolio_image1,
    },
    {
      key: "portfolio_image2",
      url: provider.portfolio_image2,
    },
    {
      key: "portfolio_image3",
      url: provider.portfolio_image3,
    },
    {
      key: "portfolio_image4",
      url: provider.portfolio_image4,
    },
    {
      key: "portfolio_image5",
      url: provider.portfolio_image5,
    },
  ].filter((img) => img.url);

  async function deleteImage(key: string) {
    const ok = confirm("Delete this image?");

    if (!ok) return;

    const { error } = await supabase
      .from("videographers")
      .update({
        [key]: null,
      })
      .eq("id", provider.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Image deleted.");

    window.location.reload();
  }

  if (images.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold">
          Portfolio Images
        </h2>

        <p className="mt-3 text-gray-500">
          No portfolio images yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">
        Portfolio Images
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div
            key={image.key}
            className="rounded-lg border p-3"
          >
            <img
              src={image.url}
              className="h-40 w-full rounded-lg object-cover"
              alt=""
            />

            <button
              onClick={() => deleteImage(image.key)}
              className="mt-3 w-full rounded-lg bg-red-600 py-2 text-white"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}