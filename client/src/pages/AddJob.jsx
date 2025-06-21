import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { backendUrl, companyToken } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const description = quillRef.current.root.innerHTML;

      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        { title, description, location, category, level, salary },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML = "";
        // Navigate instead of reloading
        setTimeout(() => navigate("/dashboard/manage-jobs"), 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
        placeholder: "Write job description here...",
      });
    }
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Post a New Job</h1>
      
      <form onSubmit={onSubmitHandler} className="space-y-6">
        {/* Job Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-200">
            Job Title*
          </label>
          <input
            id="title"
            className="text-white w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            type="text"
            placeholder="e.g. Frontend Developer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Job Description*
          </label>
          <div className="bg-white rounded-md border border-gray-300">
            <div 
              ref={editorRef} 
              className="min-h-[200px] max-h-[400px] overflow-y-auto"
            />
          </div>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Job Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-200">
              Job Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-transparent text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {JobCategories.map((category, index) => (
                <option className="text-black" key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Job Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-200">
              Job Location
            </label>
            <select
              id="location"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-transparent text-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {JobLocations.map((location, index) => (
                <option className="text-black" key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Job Level */}
          <div className="space-y-2">
            <label htmlFor="level" className="block text-sm font-medium text-gray-200">
              Job Level
            </label>
            <select
              id="level"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-transparent text-white"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option className="text-black" value="Beginner Level">Beginner Level</option>
              
              <option className="text-black" value="Intermediate Level">Intermediate Level</option>
              <option className="text-black" value="Senior Level">Senior Level</option>
              
            </select>
          </div>

          {/* Salary */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <label htmlFor="salary" className="block text-sm font-medium text-gray-200">
              Salary (per annum)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">₹</span>
              </div>
              <input
                id="salary"
                min={0}
                className="block w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 text-white focus:border-transparent"
                type="number"
                placeholder="e.g. 500000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Post Job
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/manage-jobs")}
            className="px-6 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;