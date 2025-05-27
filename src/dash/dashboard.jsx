import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Users, MessageSquare, Menu, CircleArrowRight } from "lucide-react";
import { LogOut } from "lucide-react";
import {  LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [departmentData, setDepartmentData] = useState([]); 

 useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackSnapshot = await getDocs(collection(db, "feedback"));

        const allDepartments = [
          "HR Department",
          "IT Department",
          "Finance Department",
          "Marketing Department",
        ];

        // Initialize counts with 0
        const departmentCounts = {};
        allDepartments.forEach((dept) => {
          departmentCounts[dept] = 0;
        });

        feedbackSnapshot.forEach((doc) => {
          const data = doc.data();
          const deptRaw = data.category?.trim();
          if (!deptRaw) return;

          // Find matching department ignoring case
          const matchedDept = allDepartments.find(
            (dept) => dept.toLowerCase() === deptRaw.toLowerCase()
          );

          if (matchedDept) {
            departmentCounts[matchedDept]++;
          } else {
            console.log("Unmatched department:", deptRaw);
          }
        });

        // Prepare data for chart
        const chartData = allDepartments.map((dept) => ({
          department: dept,
          count: departmentCounts[dept],
        }));

        setDepartmentData(chartData);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchData();
  }, []);

const colors = {
  "HR Department": "#8884d8",
  "IT Department": "#82ca9d",
  "Finance Department": "#ffc658",
  "Marketing Department": "#ff7f50",
};

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // open sidebar on large screens, closed on mobile
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "profiles"));
      const users = usersSnapshot.docs
        .map((doc) => doc.data())
        .filter((profile) => profile.email !== "jaiswal1@gmail.com");

      const feedbackSnapshot = await getDocs(collection(db, "feedback"));
      const feedbacks = feedbackSnapshot.docs
        .map((doc) => doc.data())
        .filter((feedback) => feedback.email !== "jaiswal1@gmail.com");

      setUserCount(users.length);
      setFeedbackCount(feedbacks.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);


  // Sidebar width logic
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

        {/* Stats */}
        <div className="p-4 md:p-6 grid grid-cols-1 flex-none md:grid-cols-2 gap-4 md:gap-6">
          {/* Users Card */}
          <div className="bg-orange-300 text-gray-800 h-30 sm:h-36 rounded-lg shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-center px-4 pt-4">
              <div>
                <p className="text-2xl sm:text-4xl font-bold">{userCount}</p>
                <h2 className="text-sm sm:text-lg font-semibold">Regsitered Users</h2>
                
              </div>
              <img
                src="/group.png"
                alt="Users Icon"
                className="h-16 w-auto sm:h-20 lg:h-20"
              />
            </div>
            <Link to="/user" className="flex items-center space-x-2 w-full">
            <button className="bg-amber-600 h-8 w-full rounded-md font-medium flex items-center justify-center text-sm sm:text-base">
              More info
              <CircleArrowRight className="h-4 sm:h-5 ml-2" />
            </button>
            </Link>
          </div>

          {/* Feedback Card */}
          <div className="bg-rose-300 text-gray-800 h-30 sm:h-36 rounded-lg shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-center px-4 pt-4">
              <div>
                <p className="text-2xl sm:text-4xl font-bold">{feedbackCount}</p>
                <h3 className="text-sm sm:text-lg font-semibold">Feedbacks Registered</h3>
              </div>
              <img
                src="/social.png"
                alt="Feedback Icon"
                className="h-16 w-auto sm:h-20 lg:h-20"
              />
            </div>
            <Link to="/feedbackr" className="flex items-center space-x-2 w-full">
            <button className="bg-rose-400 h-8 w-full rounded-md font-medium flex items-center justify-center text-sm sm:text-base">
              More info
              <CircleArrowRight className="h-4 sm:h-5 ml-2" />
            </button>
            </Link>
          </div>
        </div>
            {/* Chart */}
   <div className="overflow-x-auto">
  <div className="min-w-[500px]" style={{ height: isMobile ? 250 : 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={departmentData}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" angle={-19}  textAnchor="end" interval={0}  />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" barSize={30}>
          {departmentData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.department]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

      </div>
    </div>
  );
}

export default Dashboard;
