// import React from 'react'

import { BiSolidMessageDetail } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import pp from "../assets/gua.jpeg";

const Settings = () => {
  return (
    <div className="">
      <div className="flex flex-col w-full">
        <div className="w-full flex justify-between">
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
        <div className="search-chats relative mt-5">
          <input
            type="text"
            className="w-full p-3 px-10 bg-[#e4eef3] outline-none rounded-xl"
            placeholder="Search settings"
          />
          <FaSearch className="absolute top-4 left-3 cursor-pointer" />
        </div>
        <div className="w-full h-fit overflow-y-auto mt-5 ">
          <div className="flex items-center p-3 gap-5 hover:bg-[#e3edf3] cursor-pointer">
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
    </div>
  );
};

export default Settings;
