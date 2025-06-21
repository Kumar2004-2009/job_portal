import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../components/Loading"; // Assuming you have a Loading component

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    backendUrl,
    userData,
    userApplications,
    fetchUserData,
    fetchUserApplications,
  } = useContext(AppContext);

  const updateResume = async () => {
    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsEdit(false);
    setResume(null);
  };

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          await Promise.all([fetchUserApplications(), fetchUserData()]);
        } catch (error) {
          toast.error("Failed to load data");
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="bg-[#101218] min-h-screen">
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        {/* Resume Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#F9F6EE] mb-3">Your Resume</h2>
          <div className="flex flex-wrap gap-2">
            {isEdit || (userData && userData.resume === "") ? (
              <>
                <label className="flex items-center gap-2" htmlFor="resumeUpload">
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg whitespace-nowrap">
                    {resume ? resume.name : "Upload Resume"}
                  </span>
                  <input
                    id="resumeUpload"
                    onChange={(e) => setResume(e.target.files[0])}
                    accept="application/pdf"
                    type="file"
                    hidden
                  />
                  <img 
                    src={assets.profile_upload_icon} 
                    alt="Upload" 
                    className="w-9 h-9"
                  />
                </label>
                <button
                  onClick={updateResume}
                  className="bg-green-100 border border-green-400 px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap"
                  disabled={!resume}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEdit(false);
                    setResume(null);
                  }}
                  className="text-gray-400 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {userData?.resume ? (
                  <a
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg whitespace-nowrap"
                    href={userData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg whitespace-nowrap">
                    No Resume Uploaded
                  </span>
                )}
                <button
                  onClick={() => setIsEdit(true)}
                  className="text-gray-400 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer whitespace-nowrap"
                >
                  {userData?.resume ? "Change" : "Upload"}
                </button>
              </>
            )}
          </div>
        </section>

        {/* Applications Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#F9F6EE]">
            Jobs Applied
          </h2>
          
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-[#F9F6EE] border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left">Company</th>
                  <th className="py-3 px-4 text-left">Job Title</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {userApplications.length > 0 ? (
                  userApplications.map((job, index) => (
                    <tr key={index} className="border-t border-gray-700 hover:bg-gray-800/50">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <img 
                          className="w-8 h-8 rounded-full object-cover" 
                          src={job.companyId.image} 
                          alt={job.companyId.name} 
                        />
                        <span>{job.companyId.name}</span>
                      </td>
                      <td className="py-3 px-4">{job.jobId.title}</td>
                      <td className="py-3 px-4">{job.jobId.location}</td>
                      <td className="py-3 px-4">{moment(job.date).format("ll")}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block min-w-[80px] text-black text-center ${
                            job.status === "Accepted"
                              ? "bg-green-300 0"
                              : job.status === "Rejected"
                              ? "bg-red-300 "
                              : "bg-blue-300 "
                          } px-3 py-1 rounded-full text-sm font-medium`}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-400">
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {userApplications.length > 0 ? (
              userApplications.map((job, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      className="w-10 h-10 rounded-full object-cover" 
                      src={job.companyId.image} 
                      alt={job.companyId.name} 
                    />
                    <div>
                      <h3 className="font-medium text-white">{job.companyId.name}</h3>
                      <p className="text-sm text-gray-300">{job.jobId.title}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-300">Location</p>
                      <p className="text-white">{job.jobId.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Date</p>
                      <p className="text-white">{moment(job.date).format("ll")}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span
                      className={`inline-block w-full text-center text-black ${
                        job.status === "Accepted"
                          ? "bg-green-300 "
                          : job.status === "Rejected"
                          ? "bg-red-300 "
                          : "bg-blue-300 "
                      } px-3 py-1.5 rounded-full text-sm font-medium`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                No applications found
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Applications;