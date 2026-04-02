import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { user } = useAuth();
  const [income, setIncome] = useState(0);
  const [income2, setIncome2] = useState(0);
  const [savingsGoalPct, setSavingsGoalPct] = useState(20);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    supabase
      .from("profiles")
      .select("income, income_2, savings_goal_pct")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setIncome(Number(data.income));
          setIncome2(Number(data.income_2));
          setSavingsGoalPct(data.savings_goal_pct);
        }
        setLoading(false);
      });
  }, [user]);

  const updateIncome = useCallback(async (value) => {
    const numValue = parseFloat(value) || 0;
    setIncome(numValue);
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ income: numValue, updated_at: new Date().toISOString() })
      .eq("id", user.id);
  }, [user]);

  const updateIncome2 = useCallback(async (value) => {
    const numValue = parseFloat(value) || 0;
    setIncome2(numValue);
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ income_2: numValue, updated_at: new Date().toISOString() })
      .eq("id", user.id);
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
    setIncome(0);
    setIncome2(0);
    setSavingsGoalPct(20);
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ income: 0, income_2: 0, savings_goal_pct: 20, updated_at: new Date().toISOString() })
      .eq("id", user.id);
  }, [user]);

  return { income, income2, savingsGoalPct, loading, updateIncome, updateIncome2, updateSavingsGoal, resetProfile };
}
