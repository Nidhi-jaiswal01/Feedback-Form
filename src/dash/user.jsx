import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Users, MessageSquare, Menu} from "lucide-react";
import { LogOut } from "lucide-react";
import {  LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; 


function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const [email, setEmail] = useState("");
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [id, setId] = useState("");
const [address, setAddress] = useState("");
const [date, setDate] = useState("");
 const [profiles, setProfiles] = useState([]);
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

   useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const currentEmail = user.email || "";
      setEmail(currentEmail);

      const fetchProfile = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "profiles"));
          const data = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((profile) => profile.email !== "jaiswal1@gmail.com"); 

          setProfiles(data);

          const matchedProfile = data.find((profile) => profile.email === currentEmail);
          if (matchedProfile) {
            setName(matchedProfile.Name);
            setPhone(matchedProfile.phone);
            setId(matchedProfile.Id);
            setAddress(matchedProfile.address);
            setDate(matchedProfile.dob);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

      fetchProfile();
    }
  });

  return () => unsubscribe();
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

<div className="overflow-x-auto max-w-screen mx-6 my-4">
  <TableContainer component={Paper}>
       <div className="sm:min-w-[800px] min-w-[610px]  px-4 py-2">
      <h1 className="font-bold mb-2">User Profile</h1>
      <hr className="border-t border-gray-600 " />
    </div>
    <Table aria-label="user profile table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">ID</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">Address</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">DOB</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">Email</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">Phone</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell component="th" scope="row">{profile.Name}</TableCell>
            <TableCell align="right">{profile.Id}</TableCell>
            <TableCell align="right">{profile.address}</TableCell>
            <TableCell align="right">{profile.dob}</TableCell>
            <TableCell align="right">{profile.email}</TableCell>
            <TableCell align="right">{profile.phone}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</div>
      </div>
    </div>
  );
}

export default Dashboard;
