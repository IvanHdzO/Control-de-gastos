import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useMonthlyHistory(income, income2) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const [{ data: expData }, { data: bonData }] = await Promise.all([
      supabase.from("expenses").select("month, amount").eq("user_id", user.id),
      supabase.from("bonuses").select("month, amount").eq("user_id", user.id),
    ]);

    const months = {};

    (expData || []).forEach((e) => {
      if (!months[e.month]) months[e.month] = { expenses: 0, bonuses: 0 };
      months[e.month].expenses += Number(e.amount);
    });

    (bonData || []).forEach((b) => {
      if (!months[b.month]) months[b.month] = { expenses: 0, bonuses: 0 };
      months[b.month].bonuses += Number(b.amount);
    });

    const salaries = income + income2;
    const rows = Object.entries(months)
      .map(([month, data]) => {
        const totalIncome = salaries + data.bonuses;
        const saved = totalIncome - data.expenses;
        const pct = totalIncome > 0 ? (saved / totalIncome) * 100 : 0;
        return { month, totalIncome, totalExpenses: data.expenses, totalBonuses: data.bonuses, saved, pct };
      })
      .sort((a, b) => b.month.localeCompare(a.month));

    setHistory(rows);
    setLoading(false);
  }, [user, income, income2]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return { history, loading, refetch: fetchHistory };
}
