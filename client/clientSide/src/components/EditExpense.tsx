import api from "./api";
import { useState, useEffect } from "react";

interface EditExpenseProps {
  expense: Expense;
  getDashboard: () => void;
  getCategories: () => void;
  cancelEdit: () => void; // Function to cancel the edit and go back
}

const EditExpense: React.FC<EditExpenseProps> = ({ expense, getDashboard, cancelEdit, getCategories }) => {
  const [formData, setFormData] = useState({
    description: expense.description,
    amount: expense.amount,
    categories: expense.categories,
    type: expense.type,
  });

  useEffect(() => {
    setFormData({
      description: expense.description,
      amount: expense.amount,
      categories: expense.categories,
      type: expense.type,
    });
  }, [expense]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/expenses/${expense.id}`, formData);
      getDashboard();
      getCategories();
      cancelEdit();  
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="description"
        required
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        type="number"
        name="amount"
        placeholder="Currency"
        required
        value={formData.amount}
        onChange={handleChange}
        step="0.01"
      />
      <select name="categories" value={formData.categories} onChange={handleChange}>
        <option value="Miscellaneous">Miscellaneous</option>
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Utilities">Utilities</option>
        <option value="Rent">Rent</option>
        <option value="Health">Health</option>
        <option value="Shopping">Shopping</option>
      </select>
      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="Expense">Expense</option>
        <option value="Income">Income</option>
        <option value="Transaction">Transaction</option>
      </select>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={cancelEdit}>Cancel</button>
    </form>
  );
};

export default EditExpense;
