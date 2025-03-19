import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement);

interface ChartProps {
    categories: string[];
    categoryCounts: number[];
    months: string[];
    monthCounts: number[];
}

const Chart: React.FC<ChartProps> = ({ categories, categoryCounts, months, monthCounts }) => {
    const formattedMonthCounts = monthCounts.length === 12 ? monthCounts : Array(12).fill(0);

    return (
        <>
          <div style={{display: "flex", flexDirection: "row", alignItems: "center",  justifyContent: "center", gap: 100}}>  
            <Doughnut 
                key={categories.join("-")} 
                data={{
                    labels: categories,
                    datasets: [{
                        label: "Category Distribution",
                        data: categoryCounts,
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40", "#3dff5a","#ff00ee","#4f0aaF"],
                        borderColor: "#fff",
                        borderWidth: 1,
                    }],
                }}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "left",
                        },
                    },
                }}
            />
        
            <Bar
                key={months.join("-")} 
                data={{
                    labels: months,
                    datasets: [{
                        label: "Monthly Distribution",
                        data: formattedMonthCounts,
                        backgroundColor: [ "#10a927"],
                        borderColor: "#fff",
                        borderWidth: 1,
                    }],
                }}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                            },
                        },
                    },
                }}
            />
            </div>
        </>
    );
};

export default Chart;
