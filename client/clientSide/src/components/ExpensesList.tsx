import { useState } from "react";
import AddExpense from "./AddExpense";
import api from "./api";
import { AxiosError } from "axios";
import EditExpense from "./EditExpense";
import styles from "../style/ExpenseList.module.css";

interface Expense {
  id: number;
  description: string;
  amount: number;
  categories: string;
  type: string;
}

interface ExpenseListProps {
  expensesData: Expense[];
  getDashboard: () => void;
  getCategories: () => void;
  getMonths: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expensesData, getDashboard, getCategories, getMonths }) => {
  const [edit, setEdit] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setEdit(true);
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await api.delete(`/expenses/${id}`);
      getDashboard();
      getCategories()
      getMonths();
    } catch (error) {
      const err = error as AxiosError;
      alert("Erro ao deletar despesa");
      console.error("Erro ao deletar despesa:", err.response?.data || err.message);
    }
  };

  const cancelEdit = () => {
    setEdit(false); 
    setExpenseToEdit(null); 
  };

  return (
    <>
    
    {edit && expenseToEdit && (
  <div className={styles.editOverlay}>
    <div className={styles.editModal}>
      <h2 className={styles.editTitle}>Edit</h2>
      <EditExpense
        expense={expenseToEdit}
        getDashboard={getDashboard}
        cancelEdit={cancelEdit}
        getCategories={getCategories}
        getMonths={getMonths}
      />
    </div>
  </div>
)}

<div className={`${styles.container} ${edit ? styles.blurredBehind : ""}`}>
  <AddExpense
    getDashboard={getDashboard}
    getCategories={getCategories}
    getMonths={getMonths}
  />

  <table className={styles.table}>
    <thead>
      <tr>
        <th>Description</th>
        <th>Amount</th>
        <th>Category</th>
        <th>Type</th>
        <th style={{ textAlign: "center" }}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {expensesData.map((val) => (
        <tr key={val.id}>
          <td>{val.description}</td>
          <td>R${val.amount}</td>
          <td>{val.categories}</td>
          <td>{val.type}</td>
          <td className={styles.actions}>
            <button
              onClick={() => handleDeleteExpense(val.id)}
              className={`${styles.button} ${styles.deleteButton}`}
            >
              Delete
            </button>
            <button
              onClick={() => handleEditExpense(val)}
              className={`${styles.button} ${styles.editButton}`}
            >
              Edit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </>

  );
};

export default ExpenseList;
