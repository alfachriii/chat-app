// import React from 'react'

import { BiSolidMessageDetail } from "react-icons/bi";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import pp from "../../assets/gua.jpeg";
import Profile from "./Profile";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const Settings = ({ closeSettings }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [hiddenSettings, setHiddenSettings] = useState(false);
  const openProfile = () => {
    setShowProfile(true);
    setHiddenSettings(true);
  };
  const closeProfile = () => {
    setShowProfile(false);
    setHiddenSettings(false);
  };

  return (
    <div>
      {!hiddenSettings ? (
        <div className="flex flex-col w-full">
          <div className="w-full flex justify-between">
            <div className="flex items-center gap-5 p-5">
              <button onClick={closeSettings}>
                <FaArrowLeft className="cursor-pointer" />
              </button>
              <h1 className="text-xl font-medium">Settings</h1>
            </div>
          </div>
          <div className="search-chats relative mt-5 flex justify-center">
            <input
              type="text"
              className="w-11/12 p-3 px-10 bg-[#e4eef3] outline-none rounded-xl"
              placeholder="Search settings"
            />
            <FaSearch className="absolute top-4 left-8 cursor-pointer" />
          </div>
          <div className="w-full h-fit overflow-y-auto mt-5 p-5">
            <div
              className="flex items-center p-3 gap-5 hover:bg-[#e3edf3] cursor-pointer"
              onClick={openProfile}
            >
              <img src={pp} alt="" className="size-24 rounded-full" />
              <div>
                <h3 className="name text-slate-900 font-medium">al</h3>
                <h4 className="info text-sm">sedang rapat</h4>
              </div>
            </div>
            <ul className="setting-list mt-5">
              <li className="py-3 p-3 gap-7 flex items-center border-b cursor-pointer hover:bg-[#e3edf3]">
                <BiSolidMessageDetail className="text-3xl" />
                <h3 className="text-lg font-medium">Chats</h3>
              </li>
              <li className="py-3 p-3 gap-7 flex items-center border-b text-red-600 cursor-pointer hover:bg-[#e3edf3]">
                <LuLogOut className="text-3xl" />
                <h3 className="text-lg font-medium">Log Out</h3>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
      <Profile onClose={closeProfile} isOpen={showProfile} />
    </div>
  );
};

export default Settings;
