import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setExpenses(data || []);
        setLoading(false);
      });
  }, [user]);

  const addExpense = useCallback(async (expense) => {
    if (!user) return;
    const row = {
      user_id: user.id,
      name: expense.name,
      amount: parseFloat(expense.amount),
      category: expense.category,
      priority: expense.priority,
      recurring: expense.recurring,
    };
    const { data, error } = await supabase
      .from("expenses")
      .insert(row)
      .select()
      .single();
    if (data) {
      setExpenses((prev) => [...prev, data]);
    }
    return { data, error };
  }, [user]);

  const updateExpense = useCallback(async (id, expense) => {
    if (!user) return;
    const updates = {
      name: expense.name,
      amount: parseFloat(expense.amount),
      category: expense.category,
      priority: expense.priority,
      recurring: expense.recurring,
    };
    // Optimistic update
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    const { error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      // Revert on error — refetch
      const { data } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      setExpenses(data || []);
    }
  }, [user]);

  const deleteExpense = useCallback(async (id) => {
    if (!user) return;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
  }, [user]);

  const resetAll = useCallback(async () => {
    if (!user) return;
    await supabase.from("expenses").delete().eq("user_id", user.id);
    await supabase
      .from("profiles")
      .update({ income: 0, savings_goal_pct: 20, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setExpenses([]);
  }, [user]);

  return { expenses, loading, addExpense, updateExpense, deleteExpense, resetAll };
}
