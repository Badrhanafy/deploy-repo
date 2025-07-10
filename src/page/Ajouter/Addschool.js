import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import { ImageIcon, Save, University, MapPin, Calendar, School, Flag, ClipboardList } from "lucide-react";
import Footer from "../Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddSchool = () => {
  const [formData, setFormData] = useState({
    nomecole: "",
    dd_construction: "",
    adress: "",
    statut: "en cours",
    type: "",
    direction: "",
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (selectedImage) {
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append("image", image);
    }

    try {
      await axios.post("http://localhost:3999/add-school", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast.success("تمت إضافة المؤسسة بنجاح", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-green-100 text-green-800 font-medium border border-green-200",
      });
      
      setTimeout(() => {
        navigate("/schools");
      }, 3000);
    } catch (error) {
      console.error("Error adding school:", error);
      toast.error("حدث خطأ أثناء إضافة المؤسسة", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-red-100 text-red-800 font-medium border border-red-200",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-arabic">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-blue-100 p-4 rounded-full mb-4">
              <University className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إضافة مؤسسة تعليمية جديدة</h1>
            <p className="text-gray-600">املأ النموذج لإضافة مؤسسة جديدة إلى النظام</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Form Section */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* School Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <School className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="nomecole"
                      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                      value={formData.nomecole}
                      onChange={handleChange}
                      placeholder="اسم المؤسسة"
                      required
                    />
                  </div>

                  {/* Construction Date */}
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <input
                      type="date"
                      name="dd_construction"
                      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                      value={formData.dd_construction}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* School Type */}
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <select
                      name="type"
                      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition appearance-none"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">اختر سلك المؤسسة</option>
                      <option value="ابتدائية">ابتدائية</option>
                      <option value="اعدادية">اعدادية</option>
                      <option value="ثانوية">ثانوية</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <Flag className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="statut"
                      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg bg-gray-50"
                      value={formData.statut}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>

                  {/* Address */}
                  <div className="relative">
                    <div className="absolute top-3 right-0 flex items-start pr-3 pointer-events-none text-gray-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <textarea
                      name="adress"
                      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                      rows="3"
                      value={formData.adress}
                      onChange={handleChange}
                      placeholder="عنوان المؤسسة"
                      required
                    ></textarea>
                  </div>

                  {/* Direction */}
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <select
                      name="direction"
                      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition appearance-none"
                      value={formData.direction}
                      onChange={handleChange}
                      required
                    >
                      <option value="">اختر المديرية</option>
                      <option value="laayoune">العيون</option>
                      <option value="boujdour">بوجدور</option>
                      <option value="essemar">السمارة</option>
                      <option value="tarfaya">طرفاية</option>
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صورة المؤسسة
                    </label>
                    <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer hover:border-blue-300 transition">
                      <div className="flex flex-col items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-blue-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {image ? image.name : "اختر صورة للمؤسسة"}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition ${
                      isSubmitting 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        تسجيل المؤسسة
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Preview Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col items-center justify-center border-r border-gray-100">
                <div className="w-full max-w-xs aspect-square bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3" />
                        <p>معاينة الصورة ستظهر هنا</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full">
                  <h3 className="font-medium text-gray-800 mb-4">معلومات المؤسسة</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الاسم:</span>
                      <span className="font-medium">{formData.nomecole || "---"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">السلك:</span>
                      <span className="font-medium">{formData.type || "---"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحالة:</span>
                      <span className="font-medium">{formData.statut || "---"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المديرية:</span>
                      <span className="font-medium">{formData.direction || "---"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
      <Footer />
    </div>
  );
};

export default AddSchool;