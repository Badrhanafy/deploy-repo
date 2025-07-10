import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar';
import Footer from '../Footer';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const SchoolGallery = () => {
  const { idecole } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [schoolName, setSchoolName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [imagesRes, schoolRes] = await Promise.all([
          axios.get(`http://localhost:3999/ecoles/${idecole}/images`),
          axios.get(`http://localhost:3999/school/${idecole}`)
        ]);
        
        setImages(imagesRes.data);
        setSchoolName(schoolRes.data.nomecole);
      } catch (err) {
        setError('Failed to load gallery');
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idecole]);

  const openImage = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    const currentIndex = images.findIndex(img => img.idimage === selectedImage.idimage);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex + 1 >= images.length ? 0 : currentIndex + 1;
    }
    
    setSelectedImage(images[newIndex]);
  };

  const downloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = `http://localhost:3999${imageUrl}`;
    link.download = `school-${idecole}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-gray-600">جاري تحميل الصور...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            معرض الصور - {schoolName}
          </h1>
          <button 
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ChevronLeft size={20} className="ml-1" />
            العودة
          </button>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد صور متاحة لهذه المؤسسة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div 
                key={image.idimage} 
                className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <LazyLoadImage
                  src={`http://localhost:3999${image.image_url}`}
                  alt={`School ${schoolName}`}
                  effect="blur"
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => openImage(image)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(image.image_url);
                    }}
                    className="p-2 bg-white bg-opacity-80 rounded-full text-gray-800 hover:bg-opacity-100"
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <button 
            onClick={closeImage}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={32} />
          </button>
          
          <button 
            onClick={() => navigateImage('prev')}
            className="absolute left-4 text-white hover:text-gray-300 p-2"
          >
            <ChevronLeft size={32} />
          </button>
          
          <div className="max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={`http://localhost:3999${selectedImage.image_url}`}
              alt="Selected"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
          
          <button 
            onClick={() => navigateImage('next')}
            className="absolute right-4 text-white hover:text-gray-300 p-2"
          >
            <ChevronRight size={32} />
          </button>
          
          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            <button 
              onClick={() => downloadImage(selectedImage.image_url)}
              className="bg-white text-gray-800 px-4 py-2 rounded-full flex items-center mx-auto hover:bg-gray-100"
            >
              <Download size={18} className="ml-1" />
              تحميل الصورة
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SchoolGallery;