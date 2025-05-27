import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Users, MessageSquare, Menu} from "lucide-react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer  } from 'recharts';
import { LineChart } from "lucide-react";


function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
const [pieChartData, setPieChartData] = useState({});

const chartColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#dc143c"];

const renderCustomizedLabel = ({ name, value, percent }) => {
  if (value === 0) return null;
  const isMobile = window.innerWidth < 640; 
  return isMobile ? `${(percent * 100).toFixed(1)}%` : `${name}: ${(percent * 100).toFixed(1)}%`;
};

const fieldLabels = {
  communication: "How effective is the communication within your team and across the company?",
  diversity: "How would you rate the company's commitment to diversity and inclusion?",
  leadership: "How would you rate the leadership provided by senior management?",
  foodService: "How are the food services in the company?",
  recognition: "How do you feel about the level of recognition you receive for your contributions?"
};


useEffect(() => {
  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "feedback"));

      const fields = ["communication", "diversity", "leadership", "foodService", "recognition"];
      const allRatings = ["Very Good", "Good", "Average", "Poor", "Very Poor"];
      
      // Initialize data structure
      const feedbackCounts = {};
      fields.forEach((field) => {
        feedbackCounts[field] = {};
        allRatings.forEach((rating) => {
          feedbackCounts[field][rating] = 0;
        });
      });

      let totalCounts = {};
      fields.forEach(field => totalCounts[field] = 0);

      snapshot.forEach((doc) => {
        const data = doc.data();
        fields.forEach((field) => {
          const value = data[field]?.trim();
          if (value) {
            const rating = allRatings.find(r => r.toLowerCase() === value.toLowerCase());
            if (rating) {
              feedbackCounts[field][rating]++;
              totalCounts[field]++;
            }
          }
        });
      });

      // Convert counts to percentages
      const result = {};
      fields.forEach((field) => {
        const total = totalCounts[field];
        result[field] = allRatings.map((rating) => ({
          name: rating,
          value: feedbackCounts[field][rating]
        }));
      });

      setPieChartData(result);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  fetchData();
}, []);


  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); 
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const sidebarWidth = isMobile
    ? sidebarOpen
      ? "w-64"
      : "w-0"
    : sidebarOpen
    ? "w-64"
    : "w-16";

  return (
    <div className="flex h-screen w-full bg-gray-100  relative overflow-hidden">
  {/* Sidebar */}
    <div
    className={`fixed top-0 left-0 h-screen bg-gray-800 text-white z-50
      ${isMobile ? (sidebarOpen ? "w-64" : "w-0") : sidebarOpen ? "w-64" : "w-16"}
      transition-all duration-300
      overflow-y-auto
    `}
  >
    <div className="flex items-center px-4 py-6">
       <img src="/admin.png" alt="Company Logo" className="h-8 w-auto"/>
      {sidebarOpen && (
        <span className="ml-2 text-xl font-bold whitespace-nowrap">Admin</span>
      )}
    </div>
    <hr className="border-t border-gray-600  w-full" />

    {(sidebarOpen || !isMobile) && (
      <ul className="space-y-4 px-2 flex-grow">
           <li className="hover:text-orange-200 px-2 cursor-pointer rounded-md ml-1 mt-4">
         <Link to="/user" className="flex items-center space-x-2 w-full">
          <Users className="w-5 h-5" />
          {sidebarOpen && <span>Registered Users</span>}
          </Link>
        </li>
         <hr className="border-t border-gray-600  w-full" />
            <li className="hover:text-orange-200 px-2 cursor-pointer rounded-md ml-1">
         <Link to="/feedbackr" className="flex items-center space-x-2 w-full">
          <MessageSquare className="w-5 h-5 mt-1" />
          {sidebarOpen && <span>Feedback Registered</span>}
          </Link>
        </li>
         <hr className="border-t border-gray-600  w-full" />
         <li className="hover:text-orange-200 px-2 cursor-pointer rounded-md ml-1">
  <Link to="/graph" className="flex items-center space-x-2 w-full">
          <LineChart className="w-5 h-5" />
          {sidebarOpen && <span>Graph Comparison</span>}
          </Link>
        </li>
         <hr className="border-t border-gray-600  w-full" />
         <li className="hover:text-orange-200 px-2 cursor-pointer rounded-md ml-1">
  <Link to="/login" className="flex items-center space-x-2 w-full">
    <LogOut className="w-5 h-5" />
    {sidebarOpen && <span>Log Out</span>}
  </Link>
</li>
<hr className="border-t border-gray-600 w-full" />

      </ul>
    )}
  </div>

  {isMobile && sidebarOpen && (
    <div
      className="fixed inset-0 bg-opacity-30 z-20"
      onClick={() => setSidebarOpen(false)}
    ></div>
  )}

      {/* Main content */}
     <div
  className={`flex-1 ml-0 ${
    sidebarOpen ? (isMobile ? "" : "ml-59") : isMobile ? "" : "ml-14"
  } flex flex-col h-screen overflow-y-auto transition-all duration-300`}
>
       
        {/* Navbar */}
        <div className="flex items-center flex-none justify-between bg-white px-4 py-2 shadow-md rounded-lg mb-4">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-gray-700 mr-4">
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/admin-dashboard" className="flex items-center space-x-2 w-full mr-4 hover:text-gray-600">
                        <span>Home</span>
                        </Link>
              
                  <Link to="/graph" className="flex items-center space-x-2 w-full mr-4 hover:text-gray-600">
                        <span>Graph</span>
                        </Link>
          </div>
        </div>

        <h1 className="ml-6 text-2xl sm:text-3xl font-semibold mb-2">Dashboard</h1>
        {/* Charts */}
        <div className="overflow-y-auto relative gap-6 p-4">
          {Object.entries(pieChartData).map(([field, data], idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md py-3 px-1 mb-6">
              <h2 className="text-lg font-semibold text-center mb-2 capitalize">{fieldLabels[field] || field}</h2>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
      layout="horizontal"
      verticalAlign="bottom"
      align="center"
      wrapperStyle={{ marginTop: 30 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
