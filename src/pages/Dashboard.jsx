import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  CalendarDays,
  X,
  Eye,
} from "lucide-react";

function Dashboard() {
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get("https://jobfinder-project-1.onrender.com/api/job/my/jobs");
      if (Array.isArray(res.data.jobs)) {
        setMyJobs(res.data.jobs);
      } else {
        toast.error("Unexpected response format from server");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/job/${id}`);
      toast.success("Job deleted successfully");
      fetchMyJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const openModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-12">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 drop-shadow-md">
          🎯 My Job Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          All your posted job listings in one beautiful place.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {myJobs.length === 0 ? (
          <div className="bg-white shadow rounded-lg py-16 text-center">
            <p className="text-gray-500 text-xl">🧾 No jobs found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-blue-100 relative"
              >
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => openModal(job)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  {job.title}
                </h3>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Company:</span> {job.company}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    {job.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    {job.jobType}
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    ${job.salary}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                    {job.jobType}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    ${job.salary}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-xl relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {selectedJob.title}
            </h2>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Type:</strong> {selectedJob.jobType}</p>
            <p><strong>Salary:</strong> ${selectedJob.salary}</p>
            <p className="mt-2 text-sm text-gray-500">
              Posted on: {new Date(selectedJob.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
