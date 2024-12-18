import { LuMessageSquarePlus } from "react-icons/lu";
import { HiDotsVertical } from "react-icons/hi";
import { FaImage, FaSearch } from "react-icons/fa";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import ChatListSkeleton from "./skeletons/ChatListSkeleton";
import Settings from "./settings/Settings";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { useChatStore } from "../store/chat.store";
import { useModalStore } from "../store/modal.store";
import { formatMessageTime, truncateText } from "../lib/utils";

const ChatList = () => {
  const { logout } = useAuthStore();
  const { setSelectedUser, newMessagesListener } = useChatStore();
  const { chatList, isContactsLoading } = useChatStore();
  const { openModal, modals } = useModalStore();
  const settingsModal = modals.find((modal) => modal.modalId === "settings");

  // useEffect(() => {
  //   getContacts();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const [showOptions, setShowOptions] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    console.log("click")
    logout();
  };

  useEffect(() => {
    newMessagesListener()

    return () => newMessagesListener()
  }, [newMessagesListener])

  console.log(chatList)
  return (
    <>
      {settingsModal ? (
        <Settings />
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
                      onClick={() => openModal("settings")}
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
            {isContactsLoading ? (
              <ChatListSkeleton />
            ) : (
              chatList.map((user) => (
                <div
                  key={user._id}
                  className="w-full h-16 py-10 p-2 flex items-center border-b cursor-pointer hover:bg-white"
                  onClick={() => setSelectedUser(user)}
                >
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt=""
                    className="rounded-full size-14"
                  />
                  <div className="ml-2 w-full">
                    <div className="w-full flex justify-between">
                      <h4 className="text-base font-semibold">{user.name}</h4>
                      <h5
                        className={`text-xs font-semibold ${
                          user.message.unreadCount > 0 && "text-sky-500"
                        }`}
                      >
                        {user.message.latestMessage &&
                          formatMessageTime(user.message.latestMessage.createdAt)}
                      </h5>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-1 items-center min-h-4">
                        {user.message.latestMessage ? (
                          user.message.latestMessage.image ? (
                            <>
                              <FaImage className="text-xs" />
                              <h5 className="text-xs">Image</h5>
                            </>
                          ) : (
                            <>
                              {user.message.unreadCount === 0 ? (
                                user.message.latestMessage.status === "sent" ? (
                                  <BsCheck2 />
                                ) : user.message.latestMessage.status === "delivered" ? (
                                  <BsCheck2All />
                                ) : (
                                  <BsCheck2All className="text-sky-400"/>
                                )
                              ) : null}
                              <h5 className="text-xs">
                                {truncateText(user.message.latestMessage.text, 40)}
                              </h5>
                            </>
                          )
                        ) : null}
                      </div>
                      {user.message.latestMessage && user.message.unreadCount > 0 ? (
                        <div className="size-5 bg-sky-300 rounded-full flex justify-center items-center">
                          <h5 className="text-xs font-semibold text-slate-100">
                            {user.message.unreadCount}
                          </h5>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div
            className="absolute bottom-5 right-10 p-4 bg-white shadow-lg shadow-slate-400 rounded-xl cursor-pointer"
            onClick={() => openModal("contact")}
          >
            <LuMessageSquarePlus className="text-2xl text-sky-500" />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatList;
