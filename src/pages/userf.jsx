import React, { useState ,useEffect} from "react";
import { Menu, X, User } from "lucide-react"; 
import {collection} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDocs } from "firebase/firestore";
import { LogOut } from "lucide-react";



function Userf() {
   const [profiles, setProfiles] = useState([]);
 const [feedbacks, setFeedbacks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const currentEmail = user.email || "";
        setEmail(currentEmail);
  
        // Fetch profile and set name
        const fetchProfile = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "profiles"));
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setProfiles(data);
  
            const matchedProfile = data.find((profile) => profile.email === currentEmail);
            if (matchedProfile) {
              setName(matchedProfile.Name);
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

const userFeedbacks = feedbacks.filter((fb) => fb.email === email);


  return (
    <div className="w-full absolute right-0 left-0 top-0">
      <nav className="bg-gray-800 text-white px-4 py-2 rounded mb-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between ">
          {/* Logo / Brand */}
          <div className="text-xl flex font-bold justify-between">
            <img
              src="/download.png"
              alt="Company Logo"
              className="h-13 mr-8 w-auto"
            />
          </div>

          {/* Mobile hamburger and user icon */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
                aria-label="User menu"
              >
                <User className="h-7 w-6.5 text-white" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
<Link
          to="/account"
          className="block px-4 py-2 hover:bg-gray-100"
          onClick={() => setDropdownOpen(false)}
        >
          Account Details
        </Link>
              <Link
                to="/userf"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Your Feedbacks
              </Link>
                    <Link
                              to="/feedback"
                              className="block px-4 py-2 hover:bg-gray-100"
                              onClick={() => setDropdownOpen(false)} >
                              Feedback Form
                            </Link>
                  <a
                    href="/login"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Log Out
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-6">
            <li>
              <a
                href="https://www.hindalco.com/"
                className="hover:text-gray-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="https://www.hindalco.com/about-us"
                className="hover:text-gray-300"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="https://www.hindalco.com/businesses"
                className="hover:text-gray-300"
              >
                Businesses
              </a>
            </li>
            <li>
              <a
                href="https://www.hindalco.com/industries"
                className="hover:text-gray-300"
              >
                Industries we Serve
              </a>
            </li>
            <li>
              <a
                href="https://www.hindalco.com/our-brands"
                className="hover:text-gray-300"
              >
                Our Brands
              </a>
            </li>
            <li>
              <a
                href="https://www.hindalco.com/contact-us"
                className="hover:text-gray-300"
              >
                Contact
              </a>
            </li>

            <li className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
                aria-label="User menu"
              >
                <User className="h-7 w-6.5 text-white" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
<Link
          to="/account"
          className="block px-4 py-2 hover:bg-gray-100"
          onClick={() => setDropdownOpen(false)}
        >
          Account Details
        </Link>
               <Link
                to="/userf"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
                 >
                       Your Feedbacks
                       </Link>
                             <Link
                                       to="/feedback"
                                       className="block px-4 py-2 hover:bg-gray-100"
                                       onClick={() => setDropdownOpen(false)} >
                                       Feedback Form
                                     </Link>
                  <a
                    href="/login"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)} >
                    Log Out
                  </a>
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="md:hidden mt-4 space-y-2">
            <li>
              <a
                href="https://www.hindalco.com/"
                className="block hover:text-gray-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="https://www.hindalco.com/about-us"
                className="block hover:text-gray-300"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="https://www.hindalco.com/businesses"
                className="block hover:text-gray-300"
              >
                Businesses
              </a>
            </li>
            <li>
              <a
                href="https://www.hindalco.com/our-brands"
                className="block hover:text-gray-300"
              >
                Our Brands
              </a>
            </li>
            <li>
              <a
                href="https://www.hindalco.com/contact-us"
                className="block hover:text-gray-300"
              >
                Contact
              </a>
            </li>
          </ul>
        )}
      </nav>
      <div className="flex flex-col md:flex-row w-full md:gap-4 ">
  {/* Left Section with Two Gray Boxes */}
  <div className="flex flex-col w-full md:w-1/4 gap-4">
    {/* First Gray Box */} 
    <div className="bg-gray-800 text-orange-50 p-6 rounded-md shadow-md flex justify-center items-center text-center ">
        <img src="/account.png" alt="Company Logo" className="h-10 md:h-13 mr-3 w-auto"/>
        <div>
      <h3 className="font-semibold ">Welcome Back!</h3>
      <p className="font-semibold ">
         {Name}
    </p>
    </div>
    </div>

    {/* Second Gray Box */}
    <div className="bg-gray-800 text-orange-50 py-6 rounded-md md:flex shadow-md hidden flex-col text-left h-70 w-full">
  {/* Profile Section */}
  <div className="mb-4 w-full">
    <h2 className="text-sm font-bold lg:text-lg lg:font-semibold flex "><User className="h-5 ml-2 mt-1 mr-1.5 mb-3 text-white" />Personal Account</h2>
    <ul className="space-y-2 pl-4">
      <li>
        <Link to="/account" >
        <button className="w-44 text-left text-sm hover:bg-gray-700 py-2 ml-7 rounded">
          Personal Information
        </button>
</Link>
      </li>
      <li>
        <button className="w-44 text-left hover:bg-gray-700 text-sm py-2 ml-7 rounded">
          Your Feedbacks
        </button>
      </li>
    </ul>
  </div>

  {/* Horizontal Line */}
  <hr className="border-t border-gray-600 my-3 w-full" />

  {/* Logout Option */}
  <div className="w-full">
    <Link to="/login" >
    <button className="w-full text-left hover:bg-gray-700 px-3 py-3 rounded">
      <h2 className="text-sm font-bold lg:text-lg lg:font-semibold flex"><LogOut className="h-5 mt-1.5 mr-1.5 text-white" />Log Out</h2>
    </button>
    </Link>
  </div>

  {/* Another Horizontal Line (optional) */}
  <hr className="border-t border-gray-600 mt-3 w-full" />
</div>

  </div>

  {/* Right Orange Box */}
  <div className="w-full md:w-full bg-orange-50 text-black p-6 rounded-md shadow-md overflow-y-auto h-99">
                  {feedbacks.length === 0 ? (
                    <p className="text-gray-500">No feedback submitted yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {userFeedbacks.map((item, index) => (
                        <li key={index} className="border p-4 rounded">
                          <p>
                            <span className="font-semibold ">Department:</span>{" "}
                            {item.category}
                          </p>
                          <p className="mt-2 ">
                            <span className="font-semibold ">Email:</span>{" "} {item.email}
                          </p>
                          <p className="mt-2 ">
                            <span className="font-semibold">Name:</span>{" "}{item.name}
                          </p>
                          <p className="mt-2 ">
                      <span className="font-semibold hidden md:inline">
                       How are the food services in the company?:
                       </span>
                       <span className="font-semibold md:hidden">
                        Food Services:
                         </span>{" "}

                        {item.foodService}
                        </p>
                           <p className="mt-2">
                      <span className="font-semibold hidden md:inline">
                              How do you feel about the level of recognition you receive
                              for your contributions?:
                            </span>
                            <span className="font-semibold md:hidden">
                        level of Recognition:
                         </span>{" "}
                            {item.recognition}
                          </p>
                          <p className="mt-2">
                      <span className="font-semibold hidden md:inline">
                              How would you rate the company's commitment to diversity
                              and inclusion?:
                            </span><span className="font-semibold md:hidden">
                        company's commitment to diversity?:
                         </span>{" "}
                            {item.diversity}
                          </p>
                           <p className="mt-2 ">
                      <span className="font-semibold hidden md:inline">
                              How would you rate the leadership provided by senior
                              management?:
                            </span>
                            <span className="font-semibold md:hidden">
                        Leadership Provided?:
                         </span>{" "}
                            {item.leadership}
                          </p>
                          <p className="mt-2">
                      <span className="font-semibold hidden md:inline">
                              How effective is the communication within your team and
                              across the company?:
                            </span>
                            <span className="font-semibold md:hidden">
                        communication accross the company:
                         </span>{" "}
                            {item.communication}
                          </p>
                          <p className="mt-2 ">
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
export default Userf;
