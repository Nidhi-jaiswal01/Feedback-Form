import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Users, MessageSquare, Menu} from "lucide-react";
import { LogOut } from "lucide-react";
import {  LineChart } from "lucide-react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [feedbacks, setFeedbacks] = useState([]);
    const [category, setCategory] = useState("");
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);


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
        const feedbackSnapshot = await getDocs(collection(db, "feedback"));
        setUserCount(usersSnapshot.size);
        setFeedbackCount(feedbackSnapshot.size);
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

    useEffect(() => {
      const fetchFeedbacks = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "feedback"));
          const data = querySnapshot.docs.map((doc) => {
            const d = doc.data();
            return {
              id: doc.id,
              ...d,
              ...d.feedback,
              ...d.feedback2,
              ...d.feedback3,
              ...d.feedback4,
              ...d.feedback5,
            };
          });
          console.log("Fetched feedback data:", data);
          setFeedbacks(data);
        } catch (error) {
          console.error("Error fetching feedbacks:", error);
        }
      };
    
      fetchFeedbacks();
    }, []);
    
    const userFeedback = category
      ? feedbacks.filter((fb) => fb.category === category)
      : feedbacks;


  return (
    <div className="flex h-screen w-full bg-gray-100 absolute top-0 right-0 overflow-hidden">
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
    sidebarOpen ? (isMobile ? "" : "ml-64") : isMobile ? "" : "ml-16"
  } flex flex-col h-screen overflow-y-auto transition-all duration-300`}
>
       
        {/* Navbar */}
        <div className="flex items-center flex-none justify-between bg-white px-4 py-2 shadow-md rounded-lg mb-4">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-gray-700 mr-4">
              <Menu className="w-6 h-6 md:ml-5" />
            </button>
            <Link to="/admin-dashboard" className="flex items-center space-x-2 w-full mr-4 hover:text-gray-600">
                                    <span>Home</span>
                                    </Link>
                          
                              <Link to="/graph" className="flex items-center space-x-2 w-full mr-4 hover:text-gray-600">
                                    <span>Graph</span>
                                    </Link>
          </div>
        </div>

        <h1 className="ml-5 md:ml-10 text-2xl sm:text-3xl font-semibold mb-2">Dashboard</h1>
        <div className=" bg-white p-6 sm:p-8 md:p-10 rounded shadow-md overflow-x-auto max-w-screen md:mx-10 mx-5 mt-4">
            <h1 className="text-lg flex font-bold mb-2 ml-1 text-black">
            Submitted Feedback
          </h1>
          <label>
          <select className="w-full p-2 border border-gray-300 rounded mt-1 bg-white mb-6"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    required>
    <option value="">Select a specific department </option>
    <option value="HR Department">HR Department</option>
    <option value="IT Department">IT Department</option>
    <option value="Finance Department">Finance Department</option>
    <option value="Marketing Department">Marketing Department</option>
    <option value="Other">other</option>
  </select>
</label>
          {feedbacks.length === 0 ? (
            <p className="text-gray-500">No feedback submitted yet.</p>
          ) : (
            <ul className="space-y-4">
              {userFeedback.map((item, index) => (
                <li key={index} className="border p-4 rounded">
                  <p className="mt-4">
                    <span className="font-semibold">Department:</span>{" "}
                    {item.category}
                  </p>
                  <p className="mt-4">
                    <span className="font-semibold">Email:</span>{" "} {item.email}
                  </p>
                  <p className="mt-4">
                    <span className="font-semibold">Name:</span>{" "} {item.name}
                  </p>
                  <p className="mt-4">
                    <span className="font-semibold">
                      How are the food services in the company?:
                    </span>{" "}
                    {item.foodService}
                  </p>
                  <p className="mt-4">
                    <span className="font-semibold">
                      How do you feel about the level of recognition you receive
                      for your contributions?:
                    </span>{" "}
                    {item.recognition}
                  </p>
                  <p className="mt-4">
                    <span className="font-semibold">
                      How would you rate the company's commitment to diversity
                      and inclusion?:
                    </span>{" "}
                    {item.diversity}
                  </p>
                  <p className="mt-4">
                    <span className="font-semibold">
                      How would you rate the leadership provided by senior
                      management?:
                    </span>{" "}
                    {item.leadership}
                  </p>
                  <p className="mt-4">
                    <span className="font-semibold">
                      How effective is the communication within your team and
                      across the company?:
                    </span>{" "}
                    {item.communication}
                  </p>
                  <p className="mt-4">
                    <span className="font-semibold">Message:</span>{" "}
                    {item.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </div>
  );
}

export default Dashboard;
