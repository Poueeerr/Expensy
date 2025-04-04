import api from "./api";
import { useState } from "react";
import style from "../style/AddExp.module.css";

interface AddExpenseProps {
    getDashboard: () => void;
    getCategories: () => void;
    getMonths: () => void;
  }

const AddExpense: React.FC<AddExpenseProps> = ({ getDashboard, getCategories, getMonths }) => {
    const [formData, setFormData] = useState({
      description: "",
      amount: "",
      categories: "Miscellaneous",
      type: "Expense",
    });
  
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
        await api.post("/expenses", formData);
        getMonths();
        getDashboard();
        getCategories();
     } catch (error) {
        console.error("Error adding expense:", error);
        alert("Failed to add expense.");
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className={style.form}>
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
    </select>

    <button type="submit">Add expense</button>
  </form>
);
  };
  
  export default AddExpense;
  