import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useSalaries() {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    supabase
      .from("salaries")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setSalaries(data || []);
        setLoading(false);
      });
  }, [user]);

  const addSalary = useCallback(async (label = "Nuevo salario") => {
    if (!user) return;
    const maxOrder = salaries.reduce((m, s) => Math.max(m, s.sort_order), -1);
    const { data } = await supabase
      .from("salaries")
      .insert({ user_id: user.id, label, amount: 0, sort_order: maxOrder + 1 })
      .select()
      .single();
    if (data) setSalaries((prev) => [...prev, data]);
  }, [user, salaries]);

  const updateSalary = useCallback(async (id, updates) => {
    if (!user) return;
    setSalaries((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    await supabase
      .from("salaries")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id);
  }, [user]);

  const deleteSalary = useCallback(async (id) => {
    if (!user) return;
    setSalaries((prev) => prev.filter((s) => s.id !== id));
    await supabase
      .from("salaries")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
  }, [user]);

  const resetSalaries = useCallback(async () => {
    if (!user) return;
    setSalaries((prev) => prev.map((s) => ({ ...s, amount: 0 })));
    await supabase
      .from("salaries")
      .update({ amount: 0 })
      .eq("user_id", user.id);
  }, [user]);

  const totalSalaries = salaries.reduce((s, sal) => s + Number(sal.amount), 0);

  return { salaries, totalSalaries, loading, addSalary, updateSalary, deleteSalary, resetSalaries };
}
