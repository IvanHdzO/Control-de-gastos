import { useState, useEffect } from "react";

const STORAGE_KEY = "control-gastos-expenses";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setExpenses(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  };

  const addExpense = (expense) => {
    const newExp = {
      ...expense,
      id: crypto.randomUUID(),
      amount: parseFloat(expense.amount),
      created_at: new Date().toISOString(),
    };
    const updated = [...expenses, newExp];
    setExpenses(updated);
    persist(updated);
  };

  const updateExpense = (id, expense) => {
    const updated = expenses.map((e) =>
      e.id === id ? { ...e, name: expense.name, amount: parseFloat(expense.amount), category: expense.category, priority: expense.priority, recurring: expense.recurring } : e
    );
    setExpenses(updated);
    persist(updated);
  };

  const deleteExpense = (id) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    persist(updated);
  };

  const resetAll = () => {
    setExpenses([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { expenses, loading, addExpense, updateExpense, deleteExpense, resetAll };
}
