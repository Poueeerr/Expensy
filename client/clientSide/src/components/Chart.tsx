import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

interface ChartProps {
    categories: string[];
    categoryCounts: number[];
}

const Chart: React.FC<ChartProps> = ({ categories, categoryCounts }) => {
    return (
            <Doughnut 
                data={{
                    labels: categories,
                    datasets: [{
                        label: 'Category Distribution',
                        data: categoryCounts,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#3dff5a','#ff00eeFF','#4f0aaF'],
                        borderColor: '#fff',
                        borderWidth: 1,
                        
                    }],
                }}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'left',
                        },
                    },
                }}
            />
        
    );
};

export default Chart;
