import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactSpeedometer from "react-d3-speedometer";
import { SearchIcon, FilterIcon, ChevronDown, ChevronUp } from "lucide-react";
import Footer from "../Footer";
import Lottie from "lottie-react";
import NotFoundAnimation from "./Animation - 1739215242873.json";
import Nodata from "./nodataAnimation.json";
import loadinganimation from "./loading animation.json";
import { MapPin } from 'lucide-react';
const SchoolsList = () => {
    const [schools, setSchools] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [direction, setDirection] = useState("");
    const [status, setStatus] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            axios
                .get("http://localhost:3999/schools")
                .then((response) => {
                    setSchools(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError("!حدث خطأ أثناء التحميل");
                    setLoading(false);
                    console.error("خطأ في التحميل !", error);
                });
        } else {
            navigate("/");
        }
    }, [navigate]);

    const filteredSchools = schools.filter((school) => {
        const matchesSearch = school.nomecole.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter ? school.typeecole === filter : true;
        const matchesDirection = direction ? school.direction === direction : true;
        const matchesStatus = status ? school.statut === status : true;
        return matchesSearch && matchesFilter && matchesDirection && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-64 h-64">
                        <Lottie animationData={loadinganimation} loop={true} />
                    </div>
                    <p className="text-xl font-medium text-blue-600 mt-4">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
                <div className="flex flex-col items-center justify-center text-center p-6 rounded-xl">
                    <div className="w-64 h-64">
                        <Lottie animationData={NotFoundAnimation} loop={true} />
                    </div>
                    <p className="text-2xl font-semibold text-red-600 mt-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-lg"
                    >
                        حاول مرة أخرى
                    </button>
                </div>
            </div>
        );
    }

    const typeCounts = ["ابتدائية", "اعدادية", "ثانوية"].map(type => ({
        type,
        count: filteredSchools.filter(school => school.typeecole === type).length,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-arabic">
            <Navbar />
            
            {/* Animated Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-6 animate-fade-in">
                            مصلحة التخطيط و الخريطة المدرسية
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                            نظام متكامل لإدارة وتتبع المؤسسات التعليمية في المنطقة
                        </p>
                    </div>

                    {/* Search Card with Glass Morphism Effect */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 max-w-3xl mx-auto border border-white/20">
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-4 py-3 rounded-xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
                                placeholder="ابحث عن اسم المدرسة..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Advanced Filters Toggle */}
                        <div className="flex justify-center mb-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
                            >
                                {showFilters ? (
                                    <>
                                        <ChevronUp className="h-5 w-5" />
                                        إخفاء خيارات البحث
                                    </>
                                ) : (
                                    <>
                                        <FilterIcon className="h-5 w-5" />
                                        بحث معمق
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Advanced Filters Section */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showFilters ? "max-h-screen opacity-100 mt-6" : "max-h-0 opacity-0"}`}>
                            <div className="bg-white/90 p-6 rounded-xl shadow-inner border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">خيارات البحث المتقدم</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* School Type Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">نوع المدرسة</label>
                                        <div className="flex flex-wrap gap-2">
                                            {typeCounts.map(({ type, count }) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setFilter(filter === type ? "" : type)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                                        filter === type 
                                                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-105" 
                                                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                                                    }`}
                                                >
                                                    {type} <span className="text-xs bg-white/20 px-2 py-1 rounded-full ml-1">{count}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Direction Filter */}
                                    <div>
                                        <label htmlFor="directionFilter" className="block text-sm font-medium text-gray-700 mb-2">المديرية</label>
                                        <select
                                            id="directionFilter"
                                            className="block w-full p-3 rounded-xl border-2 border-blue-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                                            value={direction}
                                            onChange={(e) => setDirection(e.target.value)}
                                        >
                                            <option value="">جميع المديريات</option>
                                            {["laayoune", "boujdour", "essemar", "tarfaya"].map((dir) => (
                                                <option key={dir} value={dir}>{dir}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">حالة المشروع</label>
                                        <div className="flex flex-wrap gap-2">
                                            {["en cours", "terminé"].map(stat => {
                                                const count = filteredSchools.filter(school => school.statut === stat).length;
                                                return (
                                                    <button
                                                        key={stat}
                                                        onClick={() => setStatus(status === stat ? "" : stat)}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                                            status === stat 
                                                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-105" 
                                                                : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                                                        }`}
                                                    >
                                                        {stat === "en cours" ? "قيد التنفيذ" : "منتهي"} <span className="text-xs bg-white/20 px-2 py-1 rounded-full ml-1">{count}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Reset Filters Button */}
                                {(filter || direction || status) && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={() => {
                                                setFilter("");
                                                setDirection("");
                                                setStatus("");
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                                        >
                                            إعادة تعيين جميع الفلاتر
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-wrap justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-700">
                            عدد النتائج: <span className="text-blue-600">{filteredSchools.length}</span>
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
                        {typeCounts.map(({ type, count }) => (
                            <div key={type} className="flex items-center">
                                <span className="text-sm text-gray-600">{type}:</span>
                                <span className="ml-1 text-sm font-medium text-blue-600">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Schools Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {filteredSchools.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-64 h-64">
                            <Lottie animationData={Nodata} loop={true} />
                        </div>
                        <p className="text-2xl font-medium text-gray-600 mt-6 animate-pulse">
                            لم يتم العثور على نتائج مطابقة
                        </p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setFilter("");
                                setDirection("");
                                setStatus("");
                            }}
                            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all"
                        >
                            عرض جميع المدارس
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSchools.map(school => (
                            <div
                                key={school.idecole}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                            >
                                {/* School Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={`http://localhost:3999${school.image}`}
                                        alt={school.nomecole}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <h3 className="text-xl font-bold text-white">{school.nomecole}</h3>
                                        <div className="flex items-center mt-1">
                                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${school.statut === 'en cours' ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                                            <span className="text-sm text-white/90">
                                                {school.statut === 'en cours' ? 'قيد التنفيذ' : 'منتهي'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* School Details */}
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                            {school.typeecole}
                                        </span>
                                        <div className="flex">
                                            <MapPin size={24} color="red" /><span className="text-sm text-gray-500 ">{school.direction}</span>
                                        </div>
                                    </div>

                                    {/* Progress Meter */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-600">نسبة الإنجاز</span>
                                            <span className="text-sm font-bold text-blue-600">{school.pourcentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div 
                                                className={`h-2.5 rounded-full ${school.pourcentage < 50 ? 'bg-red-400' : school.pourcentage < 80 ? 'bg-yellow-400' : 'bg-green-400'}`} 
                                                style={{ width: `${school.pourcentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col space-y-3">
                                        <Link
                                            to={`/school/${school.idecole}`}
                                            className="text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-300"
                                        >
                                            تفاصيل المؤسسة
                                        </Link>
                                        <button
                                            onClick={() => navigate(`/TaskSelector/${school.idecole}`)}
                                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-300"
                                        >
                                            أدخل المهام
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default SchoolsList;