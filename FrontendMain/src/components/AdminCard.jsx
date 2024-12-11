import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EncryptionStats = () => {
  const [counts, setCounts] = useState({
    today: 0,
    yesterday: 0,
    last_7_days: 0,
    last_30_days: 0,
    daily_counts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/encryption-counts");
        if (response.data.success) {
          setCounts(response.data.counts);
        } else {
          setError(response.data.error || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message || "Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  const getLast7Dates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toLocaleDateString("en-US"));
    }
    return dates;
  };

  const barChartData = {
    labels: getLast7Dates(),
    datasets: [
      {
        label: "Encryptions",
        data: counts.daily_counts,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        barPercentage: 0.5,
        categoryPercentage: 0.7,
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="pt-20 p-8 min-h-screen flex justify-center items-center "> {/* Added padding-top to push content below navbar */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 w-full max-w-4xl hover:shadow-2xl">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="text-center flex-1">
            <h3 className="text-lg font-semibold mb-2">Today</h3>
            <p className="text-5xl font-bold">{counts.today}</p>
          </div>
          <div className="text-center flex-1">
            <h3 className="text-lg font-semibold mb-2">Yesterday</h3>
            <p className="text-5xl font-bold">{counts.yesterday}</p>
          </div>
          <div className="text-center flex-1">
            <h3 className="text-lg font-semibold mb-2">Last 7 Days</h3>
            <p className="text-5xl font-semibold">{counts.last_7_days}</p>
          </div>
          <div className="text-center flex-1">
            <h3 className="text-lg font-semibold mb-2">Last 30 Days</h3>
            <p className="text-5xl font-bold">{counts.last_30_days}</p>
          </div>
        </div>
        <div className="p-6 flex flex-col justify-center items-center">
          <h3 className="text-2xl font-semibold text-gray-700 text-center mb-4">
            Encryption Activity Over the Last 7 Days
          </h3>
          <div className="w-full max-w-4xl h-80 flex justify-center items-center">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncryptionStats;
