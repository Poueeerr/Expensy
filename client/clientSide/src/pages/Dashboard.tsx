import { useNavigate } from "react-router";
import api from "../components/api";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import ExpenseList from "../components/ExpensesList";
import Chart from "../components/Chart";
import style from "../style/Dashboard.module.css";

interface Expense {
    id: number;
    description: string;
    amount: number;
    categories: string;
    type: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryCounts, setCategoryCounts] = useState<number[]>([]);
    
    const [months, setMonths] = useState<string[]>([]);
    const [monthCounts, setMonthCounts] = useState<number[]>([]);

    const [error, setError] = useState<string>("");

    async function getCategories() {
        try {
            const response = await api.get("/expenses/categories");
            const data = response.data;
            
            const categoryMap: Record<string, number> = {};
            data.forEach((category: { categories: string }) => {
                categoryMap[category.categories] = (categoryMap[category.categories] || 0) + 1;
            });
    
            const categoryList = Object.keys(categoryMap);
            const categoryCount = Object.values(categoryMap);
    
            setCategories(categoryList);
            setCategoryCounts(categoryCount);
        } catch (error) {
            const err = error as AxiosError;
            setError("Erro ao buscar categorias: " + (err.response?.data || err.message));
            console.log(err.response?.data || err.message);
        }
    }

    async function getMonths() {
        try {
            const response = await api.get("/expenses/date");
            const rawDates: string[] = response.data; 

            const monthCount: number[] = Array(12).fill(0);
    
            rawDates.forEach(dateString => {
                const date = new Date(dateString); 
                const monthIndex = date.getUTCMonth(); 
    
                monthCount[monthIndex]++; 
            });
    
            console.log(monthCount); 
    
            setMonthCounts(monthCount);
            setMonths(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
    
        } catch (error) {
            const err = error as AxiosError;
            setError("Erro ao buscar datas: " + (err.response?.data || err.message));
            console.log(err.response?.data || err.message);
        }
    }
    
    async function getDashboard() {
        try {
            const response = await api.get("/expenses");
            setExpenses(response.data);
        } catch (error) {
            setError("Você não está logado!");
            const err = error as AxiosError;
            navigate("/");
            console.error("Erro ao buscar dados:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    useEffect(() => {
        getDashboard();
        getCategories();
        getMonths()
        }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
        
    <div>
        <h1>Dashboard</h1>
        <div className={style.container}>
            
                
            <div className={style.chart}>
                {categories.length > 0 && categoryCounts.length > 0 && (
                    <>
                    <Chart categories={categories} categoryCounts={categoryCounts} months={months} monthCounts={monthCounts}/>
                    </>
                )}
            </div>
            <div className={style.table}>
                    <ExpenseList expensesData={expenses} getDashboard={getDashboard} getCategories={getCategories}  getMonths={getMonths}/>
            </div>

        </div>
        <div className={style.logout}>
            <button onClick={logout} >
                Logout
            </button>
        </div>
    </div>
    </>
    );
}

export default Dashboard;
