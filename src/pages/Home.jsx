import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard.jsx";
import { toast } from "react-toastify";
import { Loader2, Search, AlertTriangle } from "lucide-react";
import axios from 'axios';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://jobfinder-project-1.onrender.com/api/job");
        setJobs(Array.isArray(res.data) ? res.data : res.data.jobs || []);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           "Error fetching jobs";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = async (jobId) => {
    if (!token) {
      toast.error("Please login to apply.");
      return;
    }

    try {
      const res = await axios.post(
        `https://jobfinder-project-1.onrender.com/api/job/${jobId}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Applied successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         "Error applying for job";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-12">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 text-transparent bg-clip-text drop-shadow-md">
          Explore Exciting Job Opportunities
        </h2>
        <p className="text-lg text-gray-600">
          Discover your next career move from the list below.
        </p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search job title..."
            className="w-full pl-10 pr-4 py-3 rounded-xl shadow-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center my-10">
          <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
          <p className="ml-2 text-gray-600">Loading jobs...</p>
        </div>
      )}

      {!loading && filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
          <AlertTriangle className="w-8 h-8 mb-2 text-yellow-500" />
          <p className="text-lg">No jobs found matching your search.</p>
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <JobCard key={job._id} job={job} onApply={handleApply} />
        ))}
      </div>
    </div>
  );
}

export default Home;
