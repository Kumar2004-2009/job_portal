import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20">
      <img width={160} src="/logo.png" alt="" />
      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-300 max-sm:hidden">Copyright @Kumar_Piyush.dev | All rights reserved.</p>
      <div className="flex gap-2.5">
        <img width={38} className="bg-white rounded-full" src={assets.linkedin_icon} alt="https://www.linkedin.com/in/kumar-piyush-1314ba1b9/" />
        <img width={38} className="bg-white rounded-full" src={assets.github_icon} alt="https://github.com/Kumar2004-2009" />
        <img width={38} className="bg-white rounded-full" src={assets.instagram_icon} alt="" />
      </div>
    </div>
  );
};

export default Footer;
