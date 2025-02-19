import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import dpLaayoune from './img/academilogo.png';
import { HomeIcon, UserPlusIcon, School, BookOpen,LogOut } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect } from "react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  /* const [dropdownOpen, setDropdownOpen] = useState(false); */
  const [showMessage, setShowMessage] = useState(false);
  const menuItems = [
    { path: "/Schools", label: "الرئيسية", icon: <HomeIcon /> },
    { path: "/Addschool", label: "أضف مؤسسة", icon: <School /> },
  ];
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate()
  const [admin,setAdmin]=useState({})
  const getIdAdminFromToken = () => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.idadmin;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };
  useEffect(() => {
    const idAdmin = getIdAdminFromToken();
    const fetchAdminData = async () => {
        if (!idAdmin) return; // Prevent fetching if no id
        try {
            const response = await axios.get(`http://localhost:3999/admin/${idAdmin}`);
            setAdmin(response.data); // Store the data in state
        } catch (error) {
            console.error('Error fetching admin:', error);
        }
    };

    fetchAdminData();
}, []);

if (admin.isSupper==="no") {
  /* document.getElementById("link").style.backgroundColor="green" */
  const link = document.getElementById("item");
  const icon = document.getElementById("icon");
    link.removeAttribute("href"); // Remove link functionality
    
    link.style.color = "gray"; // Change color to indicate it's disabled
    link.style.cursor = "not-allowed"; // Show "disabled" cursor
    link.style.pointerEvents = "none"; // Disable clicking
   
   
    
    
    

}


  //////
  function showConfirm() {
    Swal.fire({
      title: "تقدم !",
      text: "هل أنت متأكد من تسجيل الخروج ؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "! نعم",
      cancelButtonText: "لا",
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout action here (e.g., clearing session, redirecting)
        Swal.fire("Logged Out!", "You have been logged out successfully.", "success");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("idAdmin");
        // Example: Redirect to login page
        setTimeout(() => {
          window.location.href = "/"; // Change this to your actual login route
        }, 1500);
      }
    });
}

  return (
    <nav className="bg-gradient-to-r from-blue-100 to-indigo-300 fixed top-0 w-full z-50 shadow-lg"
    style={{
      position:"fixed",
      left:"0vh",
      
      
    }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <NavLink
          to="/Schools"
          id="title2"
          className="flex items-center text-white text-2xl font-bold hover:scale-105 transition-transform duration-300"
        >
          <img src={dpLaayoune} alt="DP Laayoune" className="w-60 h-20 mt-2" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 relative">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              id="title2"
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold flex items-center justify-center px-4 py-2 rounded-md bg-blue-700 shadow-lg transform transition-all duration-300"
                  : "text-white hover:text-blue-300 flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 hover:scale-105"
              }
            >
              {item.icon} <span className="ml-2">{item.label}</span>
            </NavLink>
          ))}

          {/* Dropdown for Add Admin and Add User */}
         

          <NavLink
            to="/Rapport"
            id="title2"
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold flex items-center justify-center px-4 py-2 rounded-md bg-blue-700 shadow-lg transform transition-all duration-300"
                : "text-white hover:text-blue-300 flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 hover:scale-105"
            }
          >
            <BookOpen />  <span className="ml-2">لائحة التقارير</span>
          </NavLink>
         
          <NavLink
            to="/AddAdmin"
            id="item"
            disabled
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold flex items-center justify-center px-4 py-2 rounded-md bg-blue-700 shadow-lg transform transition-all duration-300"
                : "text-white hover:text-blue-300 flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 hover:scale-105"
            }
          >
            <UserPlusIcon id="icon"/>  <span className="ml-2"> أضف أدمين</span>
          </NavLink>
                   {/* Log-out button with hover message */}
                   <div className="relative">
            <button
              className="btn btn-danger"
              onClick={showConfirm}
              onMouseEnter={() => setShowMessage(true)}
              onMouseLeave={() => setShowMessage(false)}
            >
              <LogOut />
            </button>
            {showMessage && (
              <p className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-sm text-red-500 bg-white p-2 rounded-md shadow-lg">
                تسجيل الخروج
              </p>
            )}
          </div>

        </div>
   
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 text-white hover:bg-blue-400 focus:outline-none transition duration-300"
          >
            <span className="sr-only">Open main menu</span>
            {!isOpen ? (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="flex flex-col space-y-2 p-4">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-white block px-4 py-2 rounded-md bg-blue-700 shadow-lg transition duration-300"
                    : "text-white block px-4 py-2 rounded-md hover:bg-blue-400 transition duration-300"
                }
              >
                {item.icon} <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}
            {/* Mobile Dropdown for Add Admin and Add User */}
            <div className="relative">
              
              
                <div className="absolute left-0 z-10 mt-0 w-full bg-white rounded-md shadow-lg">
                  <NavLink
                    to="/AddAdmin"
                    className="block px-4 py-2 text-black hover:bg-blue-100 transition duration-300"
                    
                  >
                    أضف أدمين
                  </NavLink>
                 
                </div>
              
            </div>
          </div>
           {/* Log-out button with hover message */}
           <div className="relative">
            <button
              className="btn btn-danger ml-6"
              onClick={showConfirm}
              onMouseEnter={() => setShowMessage(true)}
              onMouseLeave={() => setShowMessage(false)}
            >
              <LogOut />
            </button>
            {showMessage && (
              <p className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-sm text-red-500 bg-white p-2 rounded-md shadow-lg">
                تسجيل الخروج
              </p>
            )}
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;