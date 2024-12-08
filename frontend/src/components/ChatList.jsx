import { HiDotsVertical } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import Settings from "./settings/Settings";
import { useAuthStore } from "../store/auth.store";
import { LuMessageSquarePlus } from "react-icons/lu";
import { useChatStore } from "../store/chat.store";

const ChatList = () => {
  const { logout } = useAuthStore();
  const { getContacts, contacts } = useChatStore();

  useEffect(() => {
    getContacts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showOptions, setShowOptions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const closeSettings = () => {
    setShowSettings(false);
    setShowOptions(false);
  };

  console.log(contacts);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <>
      {showSettings ? (
        <Settings closeSettings={closeSettings} />
      ) : (
        <div className="relative h-full">
          <div className="flex flex-col w-full">
            <div className="w-full flex justify-between p-5">
              <h1 className="text-xl font-semibold">Chats</h1>
              <div className="relative">
                <button onClick={() => setShowOptions(!showOptions)}>
                  <HiDotsVertical className="mt-1 text-xl cursor-pointer" />
                </button>
                {showOptions ? (
                  <div className="absolute z-50 top-10 right-0 bg-sky-50 py-2 shadow-md shadow-slate-400 transition duration-500 ease-in-out">
                    <button
                      className="w-full flex text-sm font-medium cursor-pointer px-8 py-3 hover:bg-[#e4edf4]"
                      onClick={() => setShowSettings(true)}
                    >
                      Settings
                    </button>
                    <button
                      className="w-full flex text-sm font-medium cursor-pointer px-8 py-3 hover:bg-[#e4edf4]"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="search-chats relative mt-5 flex justify-center">
              <input
                type="text"
                className="w-11/12 p-3 px-10 bg-[#e4eef3] outline-none rounded-xl"
                placeholder="Search chat"
              />
              <FaSearch className="absolute top-4 left-8 cursor-pointer" />
            </div>
          </div>
          <div className="chats-list relative mt-2 overflow-y-auto min-h-32 max-h-[500px] p-5">
            {contacts.map((user) => (
              <div
                key={user._id}
                className="w-full h-16 py-10 p-2 flex items-center border-b cursor-pointer hover:bg-white"
              >
                <img src={user.profilePic || "/avatar.png"} alt="" className="rounded-full size-14" />
                <div className="ml-2 w-full">
                  <div className="w-full flex justify-between">
                    <h4 className="text-base font-semibold">{user.name}</h4>
                    <h5 className="text-xs font-semibold mr-2">12:11 PM</h5>
                  </div>
                  <h5 className="text-xs">Helloo apa kabbss nih..</h5>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-5 right-10 p-4 bg-white shadow-lg shadow-slate-400 rounded-xl cursor-pointer">
            <LuMessageSquarePlus className="text-2xl text-sky-500" />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatList;
