import { useState, useEffect } from "react";

const STORAGE_KEY = "control-gastos-profile";

export function useProfile() {
  const [income, setIncome] = useState(0);
  const [savingsGoalPct, setSavingsGoalPct] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setIncome(data.income ?? 0);
        setSavingsGoalPct(data.savingsGoalPct ?? 20);
      }
    } catch {}
    setLoading(false);
  }, []);

  const persist = (inc, pct) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ income: inc, savingsGoalPct: pct }));
    } catch {}
  };

  const updateIncome = (value) => {
    const numValue = parseFloat(value) || 0;
    setIncome(numValue);
    persist(numValue, savingsGoalPct);
  };

  const updateSavingsGoal = (value) => {
    const intValue = parseInt(value);
    setSavingsGoalPct(intValue);
    persist(income, intValue);
  };

  const resetProfile = () => {
    setIncome(0);
    setSavingsGoalPct(20);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { income, savingsGoalPct, loading, updateIncome, updateSavingsGoal, resetProfile };
}
