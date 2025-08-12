import React from "react";
import { toast } from "react-toastify";
import { Briefcase, MapPin, Clock } from "lucide-react";

function JobCard({ job, onApply }) {
  const handleApply = () => {
    toast.success(`Applied to ${job.title} at ${job.company}`);
    console.log("Applying for job ID:", job._id);
    onApply(job._id);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-semibold text-blue-700 mb-3">{job.title}</h3>
        <p className="text-gray-800 font-semibold flex items-center gap-2 mb-1">
          <Briefcase className="w-5 h-5 text-blue-500" />
          {job.company}
        </p>
        <p className="text-gray-500 flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-blue-400" />
          {job.location}
        </p>
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          {job.jobType}
        </p>
      </div>

      <button
        onClick={handleApply}
        aria-label={`Apply to ${job.title} at ${job.company}`}
        className="mt-6 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Apply
      </button>
    </div>
  );
}

export default JobCard;
