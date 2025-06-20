import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='bg-[#101218]'>
      <Navbar/>
      <Hero/>
      <JobListing/>
      <Footer/>
    </div>
  )
}

export default Home
