import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import dpLaayoune from './img/academilogo.png';
import { Home, UserPlus, School, BookOpen, LogOut, Menu, X } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();

  const menuItems = [
    { path: "/Schools", label: "الرئيسية", icon: <Home size={20} /> },
    { path: "/Addschool", label: "أضف مؤسسة", icon: <School size={20} /> },
    { path: "/Rapport", label: "لائحة التقارير", icon: <BookOpen size={20} /> }
  ];

  const getIdAdminFromToken = () => {
    const token = sessionStorage.getItem("token");
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
      if (!idAdmin) return;
      try {
        const response = await axios.get(`http://localhost:3999/admin/${idAdmin}`);
        setAdmin(response.data);
      } catch (error) {
        console.error('Error fetching admin:', error);
      }
    };
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "تأكيد الخروج",
      text: "هل أنت متأكد من رغبتك في تسجيل الخروج؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، سجل خروج",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("idAdmin");
        navigate("/");
      }
    });
  };

  return (
    <>
      {/* Dark overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav className="bg-white shadow-sm fixed top-0 w-full z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to="/Schools" className="flex items-center">
                <img 
                  src={dpLaayoune} 
                  alt="Logo" 
                  className="h-14 w-auto hover:scale-105 transition-transform duration-300" 
                />
              </NavLink>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-2 rounded-lg mx-1
                    transition-all duration-300
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'}
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}

              {/* Add Admin Link (Conditional) */}
              <NavLink
                to="/AddAdmin"
                className={`
                  flex items-center px-4 py-2 rounded-lg mx-1
                  transition-all duration-300
                  ${admin.isSupper === "no" 
                    ? 'text-gray-400 cursor-not-allowed pointer-events-none' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'}
                `}
              >
                <span className="mr-2"><UserPlus size={20} /></span>
                أضف أدمين
              </NavLink>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 ml-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-red-500 transition-colors duration-300"
                aria-label="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none transition-all duration-300"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X size={24} className="block" />
                ) : (
                  <Menu size={24} className="block" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <img 
                src={dpLaayoune} 
                alt="Logo" 
                className="h-12 w-auto" 
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 mx-2 rounded-lg
                    transition-all duration-300
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'}
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}

              {/* Add Admin Link (Conditional) */}
              <div
                className={`
                  flex items-center px-4 py-3 mx-2 rounded-lg
                  transition-all duration-300
                  ${admin.isSupper === "no" 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'}
                `}
                onClick={() => {
                  if (admin.isSupper !== "no") {
                    navigate("/AddAdmin");
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                <span className="mr-3"><UserPlus size={20} /></span>
                أضف أدمين
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-300"
              >
                <span className="mr-2"><LogOut size={20} /></span>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;