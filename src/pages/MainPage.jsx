import { useState } from "react";
import { CATEGORIES } from "../lib/constants";
import { getCurrentMonth } from "../lib/month";
import { useProfile } from "../hooks/useProfile";
import { useExpenses } from "../hooks/useExpenses";
import { useBonuses } from "../hooks/useBonuses";
import { useMonthlyHistory } from "../hooks/useMonthlyHistory";
import styles from "../styles/styles";
import Header from "../components/Header";
import TabBar from "../components/TabBar";
import IncomeBar from "../components/IncomeBar";
import Dashboard from "../components/Dashboard";
import ExpenseList from "../components/ExpenseList";
import ExpenseModal from "../components/ExpenseModal";
import SavingsTab from "../components/SavingsTab";
import HistoryTab from "../components/HistoryTab";

export default function MainPage() {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth);
  const { income, income2, savingsGoalPct, loading: profileLoading, updateIncome, updateIncome2, updateSavingsGoal, resetProfile } = useProfile();
  const { expenses, loading: expensesLoading, addExpense, updateExpense, deleteExpense, resetAll } = useExpenses(currentMonth);
  const { bonuses, totalBonuses, loading: bonusesLoading, addBonus, deleteBonus, resetBonuses } = useBonuses(currentMonth);
  const { history, loading: historyLoading } = useMonthlyHistory(income, income2);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Total income = both salaries + bonuses
  const totalIncome = income + income2 + totalBonuses;

  // Derived values
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const savingsGoal = totalIncome * (savingsGoalPct / 100);
  const remaining = totalIncome - totalExpenses;
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
    await resetBonuses();
    resetProfile();
    setActiveTab("dashboard");
  };

  if (profileLoading || expensesLoading || bonusesLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <Header month={currentMonth} onMonthChange={setCurrentMonth} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <IncomeBar
        income={income}
        income2={income2}
        totalBonuses={totalBonuses}
        totalIncome={totalIncome}
        remaining={remaining}
        onUpdateIncome={updateIncome}
        onUpdateIncome2={updateIncome2}
        bonuses={bonuses}
        onAddBonus={addBonus}
        onDeleteBonus={deleteBonus}
      />

      {activeTab === "dashboard" && (
        <Dashboard
          totalExpenses={totalExpenses}
          savingsGoal={savingsGoal}
          savingsGoalPct={savingsGoalPct}
          remaining={remaining}
          annualSavings={annualSavings}
          onTrack={onTrack}
          byCategory={byCategory}
          income={totalIncome}
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
          income={totalIncome}
          remaining={remaining}
          onTrack={onTrack}
          eliminable={eliminable}
          reducible={reducible}
          potentialSavings={potentialSavings}
          onReset={handleReset}
        />
      )}

      {activeTab === "historial" && (
        <HistoryTab history={history} loading={historyLoading} />
      )}
    </div>
  );
}
