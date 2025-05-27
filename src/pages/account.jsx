import React, { useState ,useEffect} from "react";
import { Menu, X, User } from "lucide-react"; 
import {collection, addDoc,updateDoc,doc  } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDocs } from "firebase/firestore";
import { Phone } from "lucide-react";
import { Mail } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { LogOut } from "lucide-react";

function Account() {
    const [profiles, setProfiles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [dob, setDate] = useState("");
    const [Name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress]=useState("");
    const[Id,setId]= useState("");

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

  const handleSave = async () => {
  try {
    const matchedProfile = profiles.find((profile) => profile.email === email);
    if (matchedProfile) {
      const profileRef = doc(db, "profiles", matchedProfile.id);
      await updateDoc(profileRef, {
        Name,
        phone,
        address,
        dob,
        Id,
      });
      alert("Profile updated successfully!");
    }
    setIsEditing(false);
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile.");
  }
};


  return (
    <div className="w-full">
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
      <div className="flex flex-col md:flex-row w-full gap-4">
  {/* Left Section with Two Gray Boxes */}
  <div className="flex flex-col w-full md:w-1/4 gap-4">
    {/* First Gray Box */} 
    <div className="bg-gray-800 text-orange-50 p-6 rounded-md shadow-md flex justify-center items-center text-center">
        <img src="/account.png" alt="Company Logo" className="h-10 md:h-13 mr-3 w-auto"/>
        <div>
      <h3 className="font-semibold text-sm">Welcome Back!</h3>
      <p className="font-semibold text-sm">
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
         <Link to="/userf" >
        <button className="w-44 text-left text-sm hover:bg-gray-700 py-2 ml-7 rounded">
          Your Feedbacks
        </button>
        </Link>
      </li>
    </ul>
  </div>

  {/* Horizontal Line */}
  <hr className="border-t border-gray-600 my-3 w-full" />

  {/* Logout Option */}
  <div className="w-full">
    <Link to="/login" >
    <button className="w-full text-left hover:bg-gray-700 px-3 py-3 rounded">
      <h2 className="text-sm font-bold lg:text-lg lg:font-semibold flex"><LogOut className="h-5  mt-1.5 mr-1.5 text-white" />Log Out</h2>
    </button>
    </Link>
  </div>

  {/* Another Horizontal Line (optional) */}
  <hr className="border-t border-gray-600 mt-3 w-full" />
</div>

  </div>

  {/* Right Orange Box */}
  <div className="w-full md:w-full bg-orange-50 text-black p-6 rounded-md shadow-md overflow-y-auto">
        <form>
                  <div className="relative w-full mb-2">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                      type="text"
                      placeholder="Enter your Name"
                      className="w-full p-2 pl-10 border rounded"
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                      readOnly={!isEditing} />
                      </div>
                       <div className="relative w-full mb-2">
                  <BadgeCheck className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                      type="text"
                      placeholder="Enter your Employee Id"
                      className="w-full p-2 pl-10 border rounded"
                      value={Id}
                      onChange={(e) => setId(e.target.value)}
                      readOnly={!isEditing} />
                      </div>
                       <div className="relative w-full mb-2">
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                      type="Date"
                      placeholder="Date of Birth"
                      className="w-full p-2 pl-10 border rounded"
                      value={dob}
                      onChange={(e) => setDate(e.target.value)}
                      readOnly={!isEditing} />
                      </div>
                      <div className="relative w-full mb-2">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                      type="text"
                      placeholder="Enter your phone number"
                      className="w-full p-2 pl-10 border rounded"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      readOnly={!isEditing} />
                      </div>
                      <div className="relative w-full mb-2">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                      type="text"
                      placeholder="Enter your address"
                      className="w-full p-2 pl-10 border rounded"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      readOnly={!isEditing} />
                      </div>

                      <div className="relative w-full mb-4">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-5.5 transform -translate-y-1/2" />
                  <input
                      type="email"
                      placeholder="Email"
                      className="w-full p-2 pl-10 border rounded"
                      value={email}
                      readOnly />
                      <div className="flex justify-end gap-2">
   
   
   {!isEditing ? (
    <button
      type="button"
      className="bg-gray-800 text-orange-50 px-4 py-1 mt-3 rounded  hover:bg-gray-300 hover:text-gray-800"
      onClick={() => setIsEditing(true)}
    >
      Edit
    </button>
  ) : (
    <>
      <button
        type="button"
        className="bg-gray-800 text-orange-50 px-4 py-1 mt-3 rounded  hover:bg-gray-300 hover:text-gray-800"
        onClick={handleSave}
      >
        Save
      </button>
      <button
        type="button"
        className="bg-gray-500 text-orange-50 px-4 py-1 mt-3 rounded hover:bg-gray-600"
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </button>
    </>
  )}
</div>
                      </div>
              </form>
          </div>
  </div>
</div>

  );
}
export default Account;
