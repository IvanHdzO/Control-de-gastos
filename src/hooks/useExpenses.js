import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";
import { getCurrentMonth, offsetMonth } from "../lib/month";

export function useExpenses(month) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const autoCopiedRef = useRef({});

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .order("created_at", { ascending: true })
      .then(async ({ data }) => {
        const items = data || [];
        // Auto-copy recurring expenses from previous month if current month is empty
        if (items.length === 0 && month === getCurrentMonth() && !autoCopiedRef.current[month]) {
          autoCopiedRef.current[month] = true;
          const prevMonth = offsetMonth(month, -1);
          const { data: prevData } = await supabase
            .from("expenses")
            .select("*")
            .eq("user_id", user.id)
            .eq("month", prevMonth)
            .eq("recurring", true);
          if (prevData && prevData.length > 0) {
            const copies = prevData.map((e) => ({
              user_id: user.id,
              name: e.name,
              amount: e.amount,
              category: e.category,
              priority: e.priority,
              recurring: true,
              month,
            }));
            const { data: inserted } = await supabase
              .from("expenses")
              .insert(copies)
              .select();
            setExpenses(inserted || []);
            setLoading(false);
            return;
          }
        }
        setExpenses(items);
        setLoading(false);
      });
  }, [user, month]);

  const addExpense = useCallback(async (expense) => {
    if (!user) return;
    const row = {
      user_id: user.id,
      name: expense.name,
      amount: parseFloat(expense.amount),
      category: expense.category,
      priority: expense.priority,
      recurring: expense.recurring,
      month,
    };
    const { data } = await supabase
      .from("expenses")
      .insert(row)
      .select()
      .single();
    if (data) {
      setExpenses((prev) => [...prev, data]);
    }
  }, [user, month]);

  const updateExpense = useCallback(async (id, expense) => {
    if (!user) return;
    const updates = {
      name: expense.name,
      amount: parseFloat(expense.amount),
      category: expense.category,
      priority: expense.priority,
      recurring: expense.recurring,
    };
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    const { error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      const { data } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", month)
        .order("created_at", { ascending: true });
      setExpenses(data || []);
    }
  }, [user, month]);

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
    await supabase.from("expenses").delete().eq("user_id", user.id).eq("month", month);
    setExpenses([]);
  }, [user, month]);

  return { expenses, loading, addExpense, updateExpense, deleteExpense, resetAll };
}
