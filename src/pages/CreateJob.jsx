import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function CreateJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full-time",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = ['title', 'company', 'location', 'salary'];
    const missingFields = requiredFields.filter(field => !form[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!token) {
      toast.error("You must be logged in to post a job.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting job with data:", JSON.stringify(form, null, 2));
      console.log("Using token:", token ? "exists" : "missing");

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "https://jobfinder-project-1.onrender.com"}/api/job`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 20000
        }
      );

      console.log("Full response:", res);
      
      if (res.status === 201) {
        toast.success("Job posted successfully!");
        navigate("/dashboard");
      } else {
        toast.error(`Unexpected status code: ${res.status}`);
      }
    } catch (err) {
      console.error("Full error details:", err);
      
      if (err.code === "ECONNABORTED") {
        toast.error("Request timed out. Server might be down or slow to respond.");
      } else if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else if (err.response.status === 404) {
          toast.error("Endpoint not found. Check the API URL.");
        } else {
          toast.error(`Server error: ${err.response.status} - ${err.response.data?.message || "No error message"}`);
        }
      } else if (err.request) {
        // No response received
        if (err.message.includes("Network Error")) {
          toast.error("Cannot connect to server. Check:");
          toast.error("1. Your internet connection");
          toast.error("2. If the backend is running");
          toast.error("3. CORS settings on the server");
        } else {
          toast.error("Network error: " + err.message);
        }
      } else {
        // Request setup error
        toast.error("Request error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] dark:bg-[#1e293b] flex items-center justify-center px-4">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl bg-white dark:bg-[#111827] rounded-2xl shadow-2xl p-8 space-y-6 border border-blue-100 dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-white">
          Post a Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Frontend Developer"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Name *
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              placeholder="e.g. Google"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="e.g. Remote or Berlin"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Salary (USD) *
            </label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              required
              min="0"
              step="1000"
              placeholder="e.g. 80000"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Type
            </label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Creating...
              </>
            ) : (
              "Create Job"
            )}
          </button>
        </form>
      </motion.div>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default CreateJob;
