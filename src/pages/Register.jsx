import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, User, Mail, Lock, Briefcase } from "lucide-react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldRegister, setShouldRegister] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setShouldRegister(true);
  };

  useEffect(() => {
    if (!shouldRegister) return;

    const registerUser = async () => {
      try {
        const res = await axios.post(
          "https://jobfinder-project-1.onrender.com/api/auth/register",
          formData
        );

        const data = res.data;

        toast.success("🎉 Account created! Please login.");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/login");
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || "Registration failed";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
        setShouldRegister(false);
      }
    };

    registerUser();
  }, [shouldRegister, formData, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transition-all space-y-6 border border-blue-100 animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center text-blue-700">
          Create Your Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-600">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full pl-10 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-600">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full pl-10 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-600">
              Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                Registering...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
