import React, { useEffect, useState } from 'react';
import Navbar from './page/navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trash2 } from "lucide-react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/////// sweet alert 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


export default function Rapport() {
  const [visites, setVisites] = useState([]);
  const [admin, setAdmin] = useState({});
  const [schools, setSchools] = useState([]);
  const [filter, setFilter] = useState(""); // Stores the selected school id
const [date,setdate]=useState("")
  const token = sessionStorage.getItem('token');
  const MySwal = withReactContent(Swal);
  // Decode the admin ID from the token
  const getIdAdminFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.idadmin;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const idadmin = getIdAdminFromToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitesRes, adminRes, schoolsRes] = await Promise.all([
          axios.get('http://localhost:3999/raportsget'), 
          idadmin ? axios.get(`http://localhost:3999/admin/${idadmin}`) : Promise.resolve({ data: {} }),
          axios.get("http://localhost:3999/schools")
        ]);
        
        setVisites(visitesRes.data);
        if (idadmin) setAdmin(adminRes.data);
        setSchools(schoolsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [idadmin]);
 
  // Handle delete with confirmation
  const handleDelete = async (id) => {
       MySwal.fire({
            title: "هل انت متأكد؟",
            text: "هذه العملية من غير الممكن الغاؤها بعد التأكيد ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم, اعي ذلك!",
            cancelButtonText:"تراجع"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Deleted!", " تم الحذف بنجاح .", "success");
              axios.delete(`http://localhost:3999/visite/${id}`);
              setVisites((prev) => prev.filter((visite) => visite.idvisite !== id));
            }
          });
    
   }
 


  // Filter ecoles relying on the school name
  const filteredVisites = filter
    ? visites.filter((visite) => visite.idecole === parseInt(filter))
    : visites;
/////////////// sweetAlert2



function CustomAlert() {
  
};

  return (
    <div className="min-h-screen bg-gray-100 mt-16 p-4">
      <Navbar />

      {/* Filter Dropdown */}
      <div className="flex justify-center mb-6">
        <select
        id="title2"
        style={{float:"left",position:"absolute",left:"170vh"}}
          className=" px-4 py-2 border rounded-md shadow-md bg-white text-gray-700"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value=""  > الكل</option>
          {schools.length > 0 ? (
            schools.map((school, i) => (
              <option value={school.idecole} key={i}>{school.nomecole}</option>
            ))
          ) : (
            <option value="">No Schools Available</option>
          )}
        </select>
       
      </div>
      

      {/* Visit Report Table */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-4" id='title2'>التقارير</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left"> تاريخ الزيارة</th>
                <th className="py-3 px-4 text-left">اسم المدرسة</th>
                <th className="py-3 px-4 text-left">التفاصيل</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredVisites.length > 0 ? (
                filteredVisites.map((visite) => (
                  <tr key={visite.idvisite} className="hover:bg-gray-100">
                    <td className="border-t py-3 px-4">({visite.datevisite.split("T")[0]})</td>
                    <td className="border-t py-3 px-4">
                      <Link className='text-blue-500 font-bold' to={`/school/${visite.idecole}`}>
                        {schools.find(s => s.idecole === visite.idecole)?.nomecole || "Unknown School"}
                      </Link>
                    </td>
                    <td className="border-t py-3 px-4">
                      <Link
                        to={`/Visitedetails/${visite.idvisite}/${visite.idecole}`}
                        className="text-blue-500 hover:underline"
                      >
                        طباعة
                      </Link>
                    </td>
                    <td className="border-t py-3 px-4">
                      <button
                        onClick={() => handleDelete(visite.idvisite) }
                        className="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-500"
                        
                      >
                        <Trash2 />
                      </button>
                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">لم يتم اضافة اية تعليقات بعد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
