"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, []);

  async function fetchUnreadCount() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: provider } = await supabase
        .from("videographers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!provider) return;

      const { count } = await supabase
        .from("enquiries")
        .select("*", { count: 'exact', head: true })
        .eq("provider_id", provider.id)
        .eq("status", "new");

      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }

  if (unreadCount === 0) return null;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
      {unreadCount}
    </span>
  );
}