import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar";

import {
  Modal,
  Button,
  Form,
  Carousel,
  Badge,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { ImagePlus, ListChecks, Edit, Trash2, Check, X } from "lucide-react";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const SchoolDetails = () => {
  const { idecole } = useParams();
  const navigate = useNavigate();

  // State management
  const [school, setSchool] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    nomecole: "",
    adress: "",
    statut: "",
    pourcentage: "",
    typeecole: "",
  });

  // Task selection
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [schoolRes, tasksRes, imagesRes] = await Promise.all([
          axios.get(`http://localhost:3999/school/${idecole}`),
          axios.get(`http://localhost:3999/tache/${idecole}`),
          axios.get(`http://localhost:3999/ecoles/${idecole}/images`),
        ]);

        const foundSchool = schoolRes.data;
        setSchool(foundSchool);
        setFormData({
          nomecole: foundSchool.nomecole,
          adress: foundSchool.adress,
          statut: foundSchool.statut,
          pourcentage: foundSchool.pourcentage,
          typeecole: foundSchool.typeecole,
        });
        setTasks(tasksRes.data);
        setImages(imagesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load school data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idecole, navigate]);

  // Task selection handlers
  const handleSelectAll = () => {
    setSelectedTasks((prev) =>
      prev.length === tasks.length ? [] : tasks.map((task) => task.idtache)
    );
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Delete operations
  const handleDeleteSelected = () => {
    if (selectedTasks.length === 0) return;

    Swal.fire({
      title: "حذف الأشغال المحددة",
      text: "هل أنت متأكد من رغبتك في حذف جميع المهام المحددة؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3999/tasks/bulk-delete`, {
            data: { idecole, taskIds: selectedTasks },
          })
          .then(() => {
            showSuccessToast("تم حذف المهام المحددة بنجاح");
            setTasks((prev) =>
              prev.filter((task) => !selectedTasks.includes(task.idtache))
            );
            setSelectedTasks([]);
          })
          .catch((error) => {
            console.error("Error deleting tasks:", error);
            showErrorToast("حدث خطأ أثناء حذف المهام");
          });
      }
    });
  };

  const confirmDeleteTask = (task) => {
    Swal.fire({
      title: "حذف الأشغال",
      text: "بحذف هذا الشق ستؤثر علي نسبة تقدم المشروع",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "! استمرار",
      cancelButtonText: "تراجع",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3999/delete/${idecole}/${task.idtache}`)
          .then(() => {
            showSuccessToast("! تم الحذف بنجاح");
            setTasks((prev) => prev.filter((t) => t.idtache !== task.idtache));
          })
          .catch((error) => {
            console.error("Error deleting task:", error);
            showErrorToast("حدث خطأ أثناء الحذف");
          });
      }
    });
  };

  // Image handling
  const handleImageUpload = async () => {
    if (!imageFile) {
      showErrorToast("! يرجى اختيار صورة لرفعها");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      await axios.post(
        `http://localhost:3999/school/${idecole}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      showSuccessToast("تم الرفع بنجاح");
      const response = await axios.get(
        `http://localhost:3999/ecoles/${idecole}/images`
      );
      setImages(response.data);
      setImageFile(null);
    } catch (error) {
      console.error("حدث خطأ أثناء رفع الصورة:", error);
      showErrorToast("حدث خطأ أثناء رفع الصورة");
    }
  };

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3999/school/${idecole}`, formData);

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await axios.post(
          `http://localhost:3999/school/${idecole}/upload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      showSuccessToast("تم التعديل بنجاح");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating school:", error);
      showErrorToast("حدث خطأ أثناء التعديل");
    }
  };

  // Modal handlers
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setImageFile(null);
  };

  // Toast helpers
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      style: {
        background: "#10b981",
        color: "#fff",
        fontWeight: "bold",
        fontFamily: "inherit",
      },
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 3000,
      style: {
        background: "#ef4444",
        color: "#fff",
        fontWeight: "bold",
        fontFamily: "inherit",
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">
            {error || "School not found"}
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* School Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            {school.nomecole}
          </h1>
          <div className="flex space-x-2">
            <Button
              variant="primary"
              onClick={handleShowModal}
              className="flex items-center"
            >
              <Edit size={18} className="ml-1" />
              تعديل
            </Button>
            <Link
              to={`/TaskSelector/${school.idecole}`}
              className="btn btn-success flex items-center"
            >
              <ListChecks size={18} className="ml-1" />
              أضف مهام
            </Link>
          </div>
        </div>

        {/* School Info and Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* School Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
              معلومات المؤسسة
            </h3>

            <div className="space-y-4">
              <InfoItem label="العنوان" value={school.adress} />
              <InfoItem label="الحالة" value={school.statut} />

              <div>
                <InfoItem label="التقدم" value={`${school.pourcentage}%`} />
                <ProgressBar
                  now={school.pourcentage}
                  variant={getProgressVariant(school.pourcentage)}
                  className="h-2 mt-1"
                  animated
                />
              </div>

              <InfoItem label="سلك المؤسسة" value={school.typeecole} />
            </div>

            {/* Image Upload */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                إضافة صورة جديدة
              </h4>
              <div className="flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <Button
                  variant="info"
                  onClick={handleImageUpload}
                  disabled={!imageFile}
                  className="ml-2 flex items-center"
                >
                  <ImagePlus size={18} className="ml-1" />
                  رفع
                </Button>
                <Link
                  to={`/school-gallery/${school.idecole}`}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2"
                >
                  <ImagePlus size={16} className="ml-1" />
                  عرض جميع الصور ({images.length})
                </Link>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {images.length >= 2 ? (
              <Carousel indicators={false} interval={5000}>
                {images.map((image, index) => (
                  <Carousel.Item key={image.idimage}>
                    <div className="relative h-80">
                      <img
                        src={`http://localhost:3999${image.image_url}`}
                        className="absolute w-full h-full object-cover"
                        alt={`School ${index + 1}`}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div className="relative h-80">
                <img
                  src={`http://localhost:3999${school.image}`}
                  className="absolute w-full h-full object-cover"
                  alt="School"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              الأشغال المنجزة ({tasks.length})
            </h3>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedTasks.length === tasks.length && tasks.length > 0
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">تحديد الكل</span>
              </div>

              <Button
                variant="danger"
                onClick={handleDeleteSelected}
                disabled={selectedTasks.length === 0}
                className="flex items-center"
              >
                <Trash2 size={16} className="ml-1" />
                حذف المحدد ({selectedTasks.length})
              </Button>
            </div>
          </div>

          {tasks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <TaskItem
                  key={task.idecoletache}
                  task={task}
                  isSelected={selectedTasks.includes(task.idtache)}
                  onSelect={() => handleTaskSelect(task.idtache)}
                  onDelete={() => confirmDeleteTask(task)}
                />
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>لم يتم انجاز أية أشغال بعد</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit School Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>تعديل معلومات المؤسسة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>اسم المؤسسة</Form.Label>
              <Form.Control
                type="text"
                name="nomecole"
                value={formData.nomecole}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>العنوان</Form.Label>
              <Form.Control
                type="text"
                name="adress"
                value={formData.adress}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>الحالة</Form.Label>
              <Form.Control
                type="text"
                name="statut"
                value={formData.statut}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>نسبة التقدم</Form.Label>
              <Form.Control
                type="number"
                name="pourcentage"
                value={formData.pourcentage}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>سلك المؤسسة</Form.Label>
              <Form.Control
                type="text"
                name="typeecole"
                value={formData.typeecole}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" className="me-2">
                حفظ
              </Button>
              <Button variant="secondary" onClick={handleCloseModal}>
                إلغاء
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
      <Footer />
    </div>
  );
};

// Helper Components
const InfoItem = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-700">{value}</span>
    <span className="font-medium text-gray-900">{label}</span>
  </div>
);

const TaskItem = ({ task, isSelected, onSelect, onDelete }) => (
  <li className="p-4 hover:bg-gray-50 flex justify-between items-center">
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <div className="ml-3">
        <span className={`${task.statut ? "text-green-600" : "text-gray-700"}`}>
          {task.nomtache}
        </span>
        <Badge bg={getBadgeVariant(task.t_pourcentage)} className="ms-2">
          {task.t_pourcentage}%
        </Badge>
      </div>
    </div>
    <Button
      variant="outline-danger"
      size="sm"
      onClick={onDelete}
      className="flex items-center"
    >
      <Trash2 size={16} className="me-1" />
      حذف
    </Button>
  </li>
);

// Helper functions
const getProgressVariant = (percentage) => {
  if (percentage < 30) return "danger";
  if (percentage < 70) return "warning";
  return "success";
};

const getBadgeVariant = (percentage) => {
  if (percentage < 30) return "danger";
  if (percentage < 70) return "warning";
  return "success";
};

export default SchoolDetails;
