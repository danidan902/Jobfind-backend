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

    if (!token) {
      toast.error("You must be logged in to post a job.");
      return;
    }

    // Validate all required fields
    if (!form.title || !form.company || !form.location || !form.salary) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://jobfinder-project-1.onrender.com/api/jobs",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        toast.success("🎉 Job posted successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error posting job:", err);
      
      let errorMessage = "Failed to post job. Please try again.";
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          errorMessage = "Session expired. Please login again.";
          localStorage.removeItem("token");
          navigate("/login");
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      toast.error(errorMessage);
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
              Salary *
            </label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              required
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
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Submit */}
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
