import React, { useContext, useEffect, useState } from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(false);
  const {companyToken, backendUrl} = useContext(AppContext);

  const fetchCompanyJobs = async() => {
    try {
      const {data} = await axios.get(`${backendUrl}/api/company/list-jobs`, {headers: {token: companyToken}});
      if(data.success) {
        setJobs(data.jobsData.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const changeJobVisibility = async(jobId) => {
    try {
      const {data} = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        {id: jobId},
        {headers: {token: companyToken}}
      );
      if(data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(companyToken) fetchCompanyJobs();
  }, [companyToken])

  if (!jobs) return <Loading />;
  
  if (jobs.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-[70vh] gap-4'>
        <p className='text-xl sm:text-2xl text-white'>No Jobs Available or posted</p>
        <button 
          onClick={() => navigate('/dashboard/add-job')} 
          className='bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition'
        >
          Add New Job
        </button>
      </div>
    );
  }

  return (
    <div className='container p-4 max-w-5xl mx-auto '>
      {/* Desktop Table View */}
      <div className='hidden md:block'>
        <div className='overflow-x-auto border border-gray-100 rounded-lg'>
          <table className='min-w-full bg-[#101218] text-white border border-gray-100 rounded-lg overflow-hidden'>
            <thead className='bg-gray-50 text-black'>
              <tr>
                <th className='py-3 text-lg px-4 text-left'>#</th>
                <th className='py-3 text-lg px-4 text-left'>Job Title</th>
                <th className='py-3 text-lg px-4 text-left'>Date</th>
                <th className='py-3 text-lg px-4 text-left'>Location</th>
                <th className='py-3 text-lg px-4 text-center'>Applicants</th>
                <th className='py-3 text-lg px-4 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((item, index) => (
                <tr key={index} className='border-t border-gray-200 hover:bg-gray-800'>
                  <td className='py-3.5 text-lg px-4'>{index + 1}</td>
                  <td className='py-3.5 text-lg px-4 font-medium'>{item.title}</td>
                  <td className='py-3.5 text-lg px-4'>{moment(item.date).format('ll')}</td>
                  <td className='py-3.5 text-lg px-4'>{item.location}</td>
                  <td className='py-3.5 text-lg px-4 text-center'>{item.applicants}</td>
                  <td className='py-3.5 text-lg px-4'>
                    <label className='flex items-center cursor-pointer'>
                      <div className='relative'>
                        <input 
                          onChange={() => changeJobVisibility(item._id)} 
                          type='checkbox' 
                          checked={item.visible}
                          className='sr-only'
                        />
                        <div className={`block w-10 h-6 rounded-full ${item.visible ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${item.visible ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <span className='ml-2 text-sm font-medium'>
                        {item.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className='md:hidden space-y-4'>
        {jobs.map((item, index) => (
          <div key={index} className='bg-white p-4 rounded-lg shadow border border-gray-200'>
            <div className='flex justify-between items-start mb-2'>
              <h3 className='font-medium text-lg'>{item.title}</h3>
              <span className='bg-gray-100 px-2 py-1 rounded text-sm'>{index + 1}</span>
            </div>
            
            <div className='space-y-2 text-sm mb-3'>
              <p><span className='font-medium'>Posted:</span> {moment(item.date).format('ll')}</p>
              <p><span className='font-medium'>Location:</span> {item.location}</p>
              <p><span className='font-medium'>Applicants:</span> {item.applicants}</p>
            </div>
            
            <div className='flex justify-between items-center'>
              <label className='flex items-center cursor-pointer'>
                <div className='relative'>
                  <input 
                    onChange={() => changeJobVisibility(item._id)} 
                    type='checkbox' 
                    checked={item.visible}
                    className='sr-only'
                  />
                  <div className={`block w-10 h-6 rounded-full ${item.visible ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${item.visible ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <span className='ml-2 text-sm font-medium'>
                  {item.visible ? 'Visible' : 'Hidden'}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6 flex justify-end'>
        <button 
          onClick={() => navigate('/dashboard/add-job')} 
          className='bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition'
        >
          Add New Job
        </button>
      </div>
    </div>
  );
}

export default ManageJobs