import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useBonuses(month) {
  const { user } = useAuth();
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    supabase
      .from("bonuses")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setBonuses(data || []);
        setLoading(false);
      });
  }, [user, month]);

  const addBonus = useCallback(async (description, amount) => {
    if (!user) return;
    const { data } = await supabase
      .from("bonuses")
      .insert({ user_id: user.id, description, amount: parseFloat(amount), month })
      .select()
      .single();
    if (data) setBonuses((prev) => [...prev, data]);
  }, [user, month]);

  const deleteBonus = useCallback(async (id) => {
    if (!user) return;
    setBonuses((prev) => prev.filter((b) => b.id !== id));
    await supabase.from("bonuses").delete().eq("id", id).eq("user_id", user.id);
  }, [user]);

  const resetBonuses = useCallback(async () => {
    if (!user) return;
    await supabase.from("bonuses").delete().eq("user_id", user.id).eq("month", month);
    setBonuses([]);
  }, [user, month]);

  const totalBonuses = bonuses.reduce((s, b) => s + Number(b.amount), 0);

  return { bonuses, totalBonuses, loading, addBonus, deleteBonus, resetBonuses };
}
