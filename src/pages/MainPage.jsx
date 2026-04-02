import { useState } from "react";
import { CATEGORIES } from "../lib/constants";
import { useProfile } from "../hooks/useProfile";
import { useExpenses } from "../hooks/useExpenses";
import styles from "../styles/styles";
import Header from "../components/Header";
import TabBar from "../components/TabBar";
import IncomeBar from "../components/IncomeBar";
import Dashboard from "../components/Dashboard";
import ExpenseList from "../components/ExpenseList";
import ExpenseModal from "../components/ExpenseModal";
import SavingsTab from "../components/SavingsTab";

export default function MainPage() {
  const { income, savingsGoalPct, loading: profileLoading, updateIncome, updateSavingsGoal } = useProfile();
  const { expenses, loading: expensesLoading, addExpense, updateExpense, deleteExpense, resetAll } = useExpenses();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Derived values
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const savingsGoal = income * (savingsGoalPct / 100);
  const remaining = income - totalExpenses;
  const annualSavings = remaining * 12;
  const onTrack = remaining >= savingsGoal;

  const byCategory = CATEGORIES.map((c) => {
    const items = expenses.filter((e) => e.category === c.id);
    const total = items.reduce((s, e) => s + Number(e.amount), 0);
    return { ...c, items, total };
  }).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const eliminable = expenses.filter((e) => e.priority === "eliminable");
  const reducible = expenses.filter((e) => e.priority === "reducible");
  const potentialSavings = eliminable.reduce((s, e) => s + Number(e.amount), 0) + reducible.reduce((s, e) => s + Number(e.amount) * 0.3, 0);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowModal(true);
  };

  const handleEditExpense = (exp) => {
    setEditingExpense(exp);
    setShowModal(true);
  };

  const handleSaveExpense = async (formData) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, formData);
    } else {
      await addExpense(formData);
    }
    setShowModal(false);
    setEditingExpense(null);
  };

  const handleReset = async () => {
    await resetAll();
    setActiveTab("dashboard");
  };

  if (profileLoading || expensesLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <IncomeBar income={income} remaining={remaining} onUpdateIncome={updateIncome} />

      {activeTab === "dashboard" && (
        <Dashboard
          totalExpenses={totalExpenses}
          savingsGoal={savingsGoal}
          savingsGoalPct={savingsGoalPct}
          remaining={remaining}
          annualSavings={annualSavings}
          onTrack={onTrack}
          byCategory={byCategory}
          income={income}
          potentialSavings={potentialSavings}
        />
      )}

      {activeTab === "gastos" && (
        <>
          <ExpenseList
            expenses={expenses}
            onAddClick={handleAddExpense}
            onEdit={handleEditExpense}
            onDelete={deleteExpense}
          />
          <ExpenseModal
            isOpen={showModal}
            onClose={() => { setShowModal(false); setEditingExpense(null); }}
            onSave={handleSaveExpense}
            editingExpense={editingExpense}
          />
        </>
      )}

      {activeTab === "ahorro" && (
        <SavingsTab
          savingsGoalPct={savingsGoalPct}
          onSavingsGoalChange={updateSavingsGoal}
          savingsGoal={savingsGoal}
          income={income}
          remaining={remaining}
          onTrack={onTrack}
          eliminable={eliminable}
          reducible={reducible}
          potentialSavings={potentialSavings}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
