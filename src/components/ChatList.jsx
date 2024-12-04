import pp from "../assets/gua.jpeg";
import { HiDotsVertical } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";

const ChatList = () => {
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full flex justify-between">
          <h1 className="text-xl font-semibold">Chats</h1>
          <div className="relative">
            <HiDotsVertical className="mt-1 text-xl cursor-pointer" />
            <div className="absolute">
                <h4 className="">Settings</h4>
            </div>
          </div>
        </div>
        <div className="search-chats relative mt-5">
          <input
            type="text"
            className="w-full p-3 px-10 bg-[#e4eef3] outline-none rounded-xl"
            placeholder="Search chat"
          />
          <FaSearch className="absolute top-4 left-3 cursor-pointer" />
        </div>
      </div>
      <div className="chats-list mt-2 overflow-y-auto min-h-32">
        <ul>
          <li className="w-full h-16 py-10 p-2 flex items-center border-b cursor-pointer hover:bg-white">
            <img src={pp} alt="" className="rounded-full size-14" />
            <div className="ml-2 w-full">
              <div className="w-full flex justify-between">
                <h4 className="text-base font-semibold">John doe</h4>
                <h5 className="text-xs font-semibold mr-2">12:11 PM</h5>
              </div>
              <h5 className="text-xs">Helloo apa kabbss nih..</h5>
            </div>
          </li>
          <li className="w-full h-16 py-10 p-2 flex items-center border-b cursor-pointer hover:bg-white">
            <img src={pp} alt="" className="rounded-full size-14" />
            <div className="ml-2 w-full">
              <div className="w-full flex justify-between">
                <h4 className="text-base font-semibold">John doe</h4>
                <h5 className="text-xs font-semibold mr-2">12:11 PM</h5>
              </div>
              <h5 className="text-xs">Helloo apa kabbss nih..</h5>
            </div>
          </li>
          <li className="w-full h-16 py-10 p-2 flex items-center border-b cursor-pointer hover:bg-white">
            <img src={pp} alt="" className="rounded-full size-14" />
            <div className="ml-2 w-full">
              <div className="w-full flex justify-between">
                <h4 className="text-base font-semibold">John doe</h4>
                <h5 className="text-xs font-semibold mr-2">12:11 PM</h5>
              </div>
              <h5 className="text-xs">Helloo apa kabbss nih..</h5>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ChatList;
