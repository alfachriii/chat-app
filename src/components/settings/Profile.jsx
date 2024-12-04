import { FaArrowLeft, FaCheck } from "react-icons/fa";
import pp from "../../assets/gua.jpeg";
import { IoCamera } from "react-icons/io5";

// eslint-disable-next-line react/prop-types
const Profile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex justify-between p-5">
        <div className="flex items-center gap-5">
          <button onClick={onClose}>
            <FaArrowLeft className="cursor-pointer" />
          </button>
          <h1 className="text-xl font-medium">Profile</h1>
        </div>
      </div>
      <div className="overflow-y-auto">
        <div className="w-full flex py-7 items-center justify-center bg-[#e4eef3]">
          <div className="relative">
            <img src={pp} alt="" className="size-44 rounded-full" />
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-sky-50 cursor-pointer">
              <IoCamera className="text-3xl text-sky-600" />
            </button>
          </div>
        </div>
        <div className="name">
          <form action="" className="flex flex-col p-5 px-7 gap-5">
            <label>
              <span className="font-medium text-sky-600">Your name</span>
            </label>
            <div>
              <input
                type="text"
                placeholder="al"
                className="w-11/12 placeholder:text-slate-700 bg-transparent outline-none"
              />
              <button>
                <FaCheck />
              </button>
            </div>
            <span className="text-xs text-slate-500">
              This is not your username or PIN. This name will be visible to
              your seechat contacts.
            </span>
          </form>
        </div>
        <div className="about">
          <form action="" className="flex flex-col p-5 px-7 gap-5">
            <label>
              <span className="font-medium text-sky-600">About</span>
            </label>
            <div>
              <input
                type="text"
                placeholder="sedang rapat"
                className="w-11/12 placeholder:text-slate-700 bg-transparent outline-none"
              />
              <button>
                <FaCheck />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
