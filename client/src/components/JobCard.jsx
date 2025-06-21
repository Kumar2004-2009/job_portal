import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import DOMPurify from "dompurify";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div className="border p-6 shadow rounded bg-[#FFFFFF]">
      <div className="flex justify-between items-center">
        <img className="h-8" src={job.companyId.image} alt="" />
      </div>
      <h4 className="font-medium  text-xl mt-2">{job.title}</h4>
      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-blue-100 border border-blue-200 px-4 py-1.5 rounded">
          {job.location}
        </span>
        <span className="bg-red-100 border border-red-200 px-4 py-1.5 rounded">
          {job.level}
        </span>
      </div>
      <p
        className="text-sm mt-4"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(job.description.slice(0, 150)),
        }}
      ></p>

      <div className="mt-4 flex gap-4 text-sm">
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Apply Now
        </button>
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="border border-gray-500 text-gray-700 px-4 py-2 rounded cursor-pointer"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
