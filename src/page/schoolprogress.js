import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { tasks } from '../taskx'; 
import { useParams } from 'react-router-dom';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiPlusCircle, FiEdit2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const TaskSelector = () => {
  const [selectedTasks, setSelectedTasks] = useState([]); 
  const [existingTasks, setExistingTasks] = useState([]); 
  const { idecole } = useParams(); 
  const [comment, setComment] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getIdAdminFromToken = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); 
        return payload.idadmin;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  const idadmin = getIdAdminFromToken();

  useEffect(() => {
    const fetchExistingTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3999/getTasksBySchool/${idecole}`,
          { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        );
        setExistingTasks(response.data);
      } catch (error) {
        console.error('خطأ في جلب المهام المدخلة مسبقًا:', error);
      }
    };

    fetchExistingTasks();
  }, [idecole]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCheckboxChange = (task, category, subCategory) => {
    setSelectedTasks((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (t) => t.nomtache === task.name && t.category === category && t.sub_category === subCategory
      );

      if (isAlreadySelected) {
        return prevSelected.filter((t) => !(t.nomtache === task.name && t.category === category && t.sub_category === subCategory));
      } else {
        return [
          ...prevSelected,
          {
            nomtache: task.name,
            category,
            sub_category: subCategory,
            t_pourcentage: task.percentage,
            idecole,
          },
        ];
      }
    });
  };

  const isTaskExisting = (name, category, subCategory) => {
    return existingTasks.some((task) => task.nomtache === name && task.category === category && task.sub_category === subCategory);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:3999/submitTasks', {
        tasks: selectedTasks,
        idecole,
        idadmin,
      });
      showSuccessToast('تم إرسال المهام بنجاح');
      setTimeout(() => navigate("/Schools"), 1500);
    } catch (error) {
      console.error('خطأ في إرسال المهام:', error);
      showErrorToast('حدث خطأ أثناء إرسال المهام');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: 'bg-green-100 text-green-800 font-medium',
      icon: <FiCheckCircle className="text-green-500 text-xl" />
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: 'bg-red-100 text-red-800 font-medium'
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showErrorToast("الرجاء إدخال تعليق");
      return;
    }

    axios.post(`http://localhost:3999/comment/${idecole}/${idadmin}`, {
      idadmin,
      idecole,
      observation: comment
    }).then(() => {
      showSuccessToast("تمت إضافة التعليق بنجاح");
      setComment("");
    }).catch((error) => {
      console.error("خطأ في إضافة التعليق:", error);
      showErrorToast("حدث خطأ أثناء إضافة التعليق");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-4">
            اختيار الأشغال
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            حدد المهام المطلوبة وأضف تعليقاتك الخاصة بالمؤسسة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Selection Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <h2 className="text-2xl font-bold text-white">قائمة المهام</h2>
              <p className="text-blue-100 mt-1">
                {selectedTasks.length} مهام محددة
              </p>
            </div>
            
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {tasks.map((categoryObj, catIndex) => (
                <div className="mb-6 last:mb-0" key={catIndex}>
                  <div 
                    className="flex justify-between items-center cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => toggleCategory(categoryObj.category)}
                  >
                    <h2 className="text-xl font-semibold text-blue-700 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {categoryObj.category}
                    </h2>
                    {expandedCategories[categoryObj.category] ? (
                      <FiChevronUp className="text-gray-500" />
                    ) : (
                      <FiChevronDown className="text-gray-500" />
                    )}
                  </div>
                  
                  {expandedCategories[categoryObj.category] && (
                    <div className="pl-6 mt-2">
                      {categoryObj.subcategories.map((subcategory, subcatIndex) => (
                        <div key={subcatIndex} className="mb-4">
                          <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            {subcategory.name}
                          </h3>
                          {subcategory.tasks ? (
                            <div className="space-y-2">
                              {subcategory.tasks.map((task, taskIndex) => (
                                <div 
                                  key={taskIndex} 
                                  className={`flex items-start p-3 rounded-lg transition-all ${
                                    isTaskExisting(task.name, categoryObj.category, subcategory.name) 
                                      ? 'bg-gray-50 opacity-75' 
                                      : 'hover:bg-blue-50 cursor-pointer'
                                  }`}
                                  onClick={() => !isTaskExisting(task.name, categoryObj.category, subcategory.name) && 
                                    handleCheckboxChange(task, categoryObj.category, subcategory.name)}
                                >
                                  <div className="flex items-center h-5">
                                    <input
                                      type="checkbox"
                                      id={`task-${catIndex}-${subcatIndex}-${taskIndex}`}
                                      className={`h-4 w-4 rounded ${
                                        isTaskExisting(task.name, categoryObj.category, subcategory.name)
                                          ? 'text-gray-300 border-gray-300'
                                          : 'text-blue-600 border-gray-300 focus:ring-blue-500'
                                      }`}
                                      checked={selectedTasks.some(
                                        (t) => t.nomtache === task.name && t.category === categoryObj.category && t.sub_category === subcategory.name
                                      ) || isTaskExisting(task.name, categoryObj.category, subcategory.name)}
                                      disabled={isTaskExisting(task.name, categoryObj.category, subcategory.name)}
                                      onChange={() => handleCheckboxChange(task, categoryObj.category, subcategory.name)}
                                    />
                                  </div>
                                  <label
                                    className={`ml-3 text-gray-700 flex-1 ${
                                      isTaskExisting(task.name, categoryObj.category, subcategory.name) 
                                        ? 'line-through' 
                                        : ''
                                    }`}
                                    htmlFor={`task-${catIndex}-${subcatIndex}-${taskIndex}`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span>{task.name}</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        task.percentage < 50 ? 'bg-red-100 text-red-800' :
                                        task.percentage < 80 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {task.percentage}%
                                      </span>
                                    </div>
                                    {isTaskExisting(task.name, categoryObj.category, subcategory.name) && (
                                      <span className="text-xs text-gray-500 flex items-center mt-1">
                                        <FiCheckCircle className="mr-1 text-green-500" />
                                        مكتملة
                                      </span>
                                    )}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 px-3">لا توجد مهام داخل هذه الفئة الفرعية</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 pb-6">
              <button
                className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center ${
                  selectedTasks.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:from-green-600 hover:to-green-700'
                } ${isSubmitting ? 'opacity-75' : ''}`}
                onClick={handleSubmit}
                disabled={selectedTasks.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </span>
                ) : (
                  <>
                    <FiPlusCircle className="ml-2" />
                    إضافة المهام المحددة ({selectedTasks.length})
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Comment Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
              <h2 className="text-2xl font-bold text-white">التعليقات والملاحظات</h2>
              <p className="text-indigo-100 mt-1">أضف ملاحظاتك حول المؤسسة</p>
            </div>

            <div className="p-6">
              <form onSubmit={handleCommentSubmit}>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    تعليقك
                  </label>
                  <textarea
                    id="comment"
                    placeholder='اكتب تعليقك هنا...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center hover:shadow-lg"
                  disabled={!comment.trim()}
                >
                  <FiEdit2 className="ml-2" />
                  إضافة التعليق
                </button>
              </form>

              {/* Recent Comments Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  التعليقات السابقة
                </h3>
                <div className="space-y-4">
                  {/* This would be populated with actual comments from your API */}
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-400">
                    <p className="text-gray-700">لا توجد تعليقات سابقة</p>
                    <p className="text-xs text-gray-500 mt-1">سيتم عرض التعليقات السابقة هنا</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="rtl:text-right"
      />
    </div>
  );
};

export default TaskSelector;