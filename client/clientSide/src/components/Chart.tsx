import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
);

interface ChartProps {
  categories: string[];
  categoryCounts: number[];
  months: string[];
  monthCounts: number[];
}

const Chart: React.FC<ChartProps> = ({
  categories,
  categoryCounts,
  months,
  monthCounts,
}) => {
  const formattedMonthCounts =
    monthCounts.length === 12 ? monthCounts : Array(12).fill(0);
  const chartReady = categories.length > 0 && categoryCounts.length > 0;

  if (!chartReady) {
    return <p>Carregando gráficos...</p>;
  }

  return (
    <div
    style={{
      display: "flex",
      flexDirection: "row", 
      justifyContent: "center",
      alignItems: "center",
      gap: "2rem",
      padding: "2rem",
      width: "100%",
      maxWidth: "900px",
      margin: "0 auto",
    }}
  >
      <div style={{ flex: "1 1 300px", maxWidth: "400px" }}>
        <Doughnut
          data={{
            labels: categories,
            datasets: [
              {
                label: "Category Distribution",
                data: categoryCounts,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#FF9F40",
                  "#3dff5a",
                  "#ff00ee",
                  "#4f0aaF",
                ],
                borderColor: "#fff",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
            },
          }}
        />
      </div>

      <div style={{ flex: "1 1 300px", maxWidth: "400px" }}>
        <Bar
          data={{
            labels: months,
            datasets: [
              {
                label: "Monthly Distribution",
                data: formattedMonthCounts,
                backgroundColor: "#10a927",
                borderColor: "#fff",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Chart;
