import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { user } = useAuth();
  const [savingsGoalPct, setSavingsGoalPct] = useState(20);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    supabase
      .from("profiles")
      .select("savings_goal_pct")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setSavingsGoalPct(data.savings_goal_pct);
        }
        setLoading(false);
      });
  }, [user]);

  const updateSavingsGoal = useCallback((value) => {
    const intValue = parseInt(value);
    setSavingsGoalPct(intValue);
    if (!user) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase
        .from("profiles")
        .update({ savings_goal_pct: intValue, updated_at: new Date().toISOString() })
        .eq("id", user.id);
    }, 500);
  }, [user]);

  const resetProfile = useCallback(async () => {
    setSavingsGoalPct(20);
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ savings_goal_pct: 20, updated_at: new Date().toISOString() })
      .eq("id", user.id);
  }, [user]);

  return { savingsGoalPct, loading, updateSavingsGoal, resetProfile };
}
