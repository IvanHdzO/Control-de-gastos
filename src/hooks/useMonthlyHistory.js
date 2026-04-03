import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useMonthlyHistory(totalSalaries) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const [{ data: expData }, { data: bonData }] = await Promise.all([
      supabase.from("expenses").select("month, amount, category").eq("user_id", user.id),
      supabase.from("bonuses").select("month, amount").eq("user_id", user.id),
    ]);

    const months = {};

    (expData || []).forEach((e) => {
      if (!months[e.month]) months[e.month] = { expenses: 0, bonuses: 0, byCategory: {} };
      months[e.month].expenses += Number(e.amount);
      if (!months[e.month].byCategory[e.category]) months[e.month].byCategory[e.category] = 0;
      months[e.month].byCategory[e.category] += Number(e.amount);
    });

    (bonData || []).forEach((b) => {
      if (!months[b.month]) months[b.month] = { expenses: 0, bonuses: 0, byCategory: {} };
      months[b.month].bonuses += Number(b.amount);
    });

    const rows = Object.entries(months)
      .map(([month, data]) => {
        const totalIncome = totalSalaries + data.bonuses;
        const saved = totalIncome - data.expenses;
        const pct = totalIncome > 0 ? (saved / totalIncome) * 100 : 0;
        return { month, totalIncome, totalExpenses: data.expenses, totalBonuses: data.bonuses, saved, pct, byCategory: data.byCategory };
      })
      .sort((a, b) => b.month.localeCompare(a.month));

    setHistory(rows);
    setLoading(false);
  }, [user, totalSalaries]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return { history, loading, refetch: fetchHistory };
}
