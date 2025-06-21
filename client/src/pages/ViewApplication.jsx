import React, { useContext, useEffect, useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets.js'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading.jsx';

const ViewApplication = () => {
    const {backendUrl, companyToken} = useContext(AppContext);
    const [applicants, setApplicants] = useState(false);

    const fetchApplicants = async() => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/company/applicants`, {headers: {token: companyToken}});
            if(data.success) {
                setApplicants(data.applictions.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const changeJobApplication = async(id, status) => {
        try {
            const {data} = await axios.post(`${backendUrl}/api/company/change-status`, {id, status}, {headers: {token: companyToken}});
            if(data.success) {
                toast.success(data.message);
                fetchApplicants();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if(companyToken) fetchApplicants();
    }, [companyToken])

    if (!applicants) return <Loading />;
    
    if (applicants.length === 0) {
        return (
            <div className='flex items-center justify-center h-[70vh]'>
                <p className='text-xl sm:text-2xl'>No Applicants</p>
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4'>
            {/* Desktop Table View */}
            <div className='hidden md:block'>
                <table className='w-full bg-white border border-gray-200 rounded-lg overflow-hidden'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-left'>#</th>
                            <th className='py-3 px-4 text-left'>User Name</th>
                            <th className='py-3 px-4 text-left'>Job Title</th>
                            <th className='py-3 px-4 text-left'>Location</th>
                            <th className='py-3 px-4 text-left'>Resume</th>
                            <th className='py-3 px-4 text-left'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants.filter((item) => item.jobId && item.userId).map((item, index) => (
                            <tr className='border-t border-gray-200 hover:bg-gray-50' key={index}>
                                <td className='py-3 px-4 text-center '>{index + 1}</td>
                                <td className='py-3 px-4 flex items-center'>
                                    <img className='w-10 h-10 rounded-full mr-3' src={item.userId.image} alt="User" />
                                    <span className='lg:block hidden'>{item.userId.name}</span>
                                </td>
                                <td className='py-3 px-4'>{item.jobId.title}</td>
                                <td className='py-3 px-4'>{item.jobId.location}</td>
                                <td className='py-3 px-4'>
                                    <a className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center hover:bg-blue-100 transition' 
                                       href={item.userId.resume} 
                                       target='_blank' 
                                       rel='noopener noreferrer'>
                                        Resume <img src={assets.resume_download_icon} alt="Download" className='w-4 h-4' />
                                    </a>
                                </td>
                                <td className='py-3 px-4'>
                                    {item.status === "Pending" ? (
                                        <div className='relative inline-block text-left group'>
                                            <button className='text-gray-500 action-button px-3 py-1 rounded hover:bg-gray-100'>...</button>
                                            <div className='z-10 hidden absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg group-hover:block'>
                                                <button onClick={() => changeJobApplication(item._id, 'Accepted')} 
                                                        className='block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100'>
                                                    Accept
                                                </button>
                                                <button onClick={() => changeJobApplication(item._id, 'Rejected')} 
                                                        className='block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100'>
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            item.status === "Accepted" ? "bg-green-100 text-green-800" : 
                                            item.status === "Rejected" ? "bg-red-100 text-red-800" : 
                                            "bg-gray-100 text-gray-800"
                                        }`}>
                                            {item.status}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className='md:hidden space-y-4'>
                {applicants.filter((item) => item.jobId && item.userId).map((item, index) => (
                    <div key={index} className='bg-white p-4 rounded-lg shadow border border-gray-200'>
                        <div className='flex items-start justify-between mb-3'>
                            <div className='flex items-center'>
                                <img className='w-12 h-12 rounded-full mr-3' src={item.userId.image} alt="User" />
                                <div>
                                    <h3 className='font-medium'>{item.userId.name}</h3>
                                    <p className='text-sm text-gray-600'>{item.jobId.title}</p>
                                </div>
                            </div>
                            <span className='text-sm bg-gray-100 px-2 py-1 rounded'>{index + 1}</span>
                        </div>
                        
                        <div className='space-y-2 text-sm mb-3'>
                            <p><span className='font-medium'>Location:</span> {item.jobId.location}</p>
                        </div>
                        
                        <div className='flex justify-between items-center'>
                            <a className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center text-sm' 
                               href={item.userId.resume} 
                               target='_blank' 
                               rel='noopener noreferrer'>
                                Resume <img src={assets.resume_download_icon} alt="Download" className='w-3 h-3' />
                            </a>
                            
                            {item.status === "Pending" ? (
                                <div className='relative inline-block text-left'>
                                    <button className='text-gray-500 action-button px-3 py-1 rounded hover:bg-gray-100'>...</button>
                                    <div className='z-10 absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg'>
                                        <button onClick={() => changeJobApplication(item._id, 'Accepted')} 
                                                className='block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100 text-sm'>
                                            Accept
                                        </button>
                                        <button onClick={() => changeJobApplication(item._id, 'Rejected')} 
                                                className='block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-sm'>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <span className={`px-2 py-1 rounded text-xs ${
                                    item.status === "Accepted" ? "bg-green-100 text-green-800" : 
                                    item.status === "Rejected" ? "bg-red-100 text-red-800" : 
                                    "bg-gray-100 text-gray-800"
                                }`}>
                                    {item.status}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewApplication;