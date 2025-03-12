import { useState } from "react";
import AddExpense from "./AddExpense";
import api from "./api";
import { AxiosError } from "axios";
import EditExpense from "./EditExpense";

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
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expensesData, getDashboard, getCategories }) => {
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
    
    {edit && expenseToEdit ? (
             <div style={{ 
              border: "1px solid black", 
              padding: "8px", 
              backgroundColor: "gray", 
              position: "absolute", 
              top: "50%", 
              left: "50%", 
              transform: "translate(-50%, -50%)", 
              height: "50%", 
              width: "50%" ,
              alignContent: "center",
              borderRadius: 20
            }}>
              <h2>Edit</h2>
              <EditExpense expense={expenseToEdit} getDashboard={getDashboard} cancelEdit={cancelEdit} getCategories={getCategories} />
            </div>
             
          ) : 
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "gray" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}>Description</th>
            <th style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}>Amount</th>
            <th style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}>Category</th>
            <th style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}>Type</th>
            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
            {expensesData.map((val) => (
              <tr key={val.id}>
                <td style={{ border: "1px solid black", padding: "8px" }}>{val.description}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>R${val.amount}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{val.categories}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{val.type}</td>
                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>
                  <button onClick={() => handleDeleteExpense(val.id)}>Delete</button>
                  <button onClick={() => handleEditExpense(val)}>Edit</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <AddExpense getDashboard={getDashboard} getCategories={getCategories}></AddExpense>
    </div>}
    </>

  );
};

export default ExpenseList;
