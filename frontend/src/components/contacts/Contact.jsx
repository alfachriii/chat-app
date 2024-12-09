import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useChatStore } from "../../store/chat.store";
import { useEffect } from "react";
import { useModalStore } from "../../store/modal.store";
import { useAuthStore } from "../../store/auth.store";

// eslint-disable-next-line react/prop-types
const Contact = ({ modal }) => {
  const { updateContact } = useAuthStore()
  const { getAllContacts, allContacts, setSelectedUser } =
    useChatStore();
  const { closeModal } = useModalStore();

  useEffect(() => {
    getAllContacts();

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  const handleStartChat = async (user) => {
    setSelectedUser(user);
    await updateContact(user.email);
    closeModal("contact");
  };

  return (
    <div className="w-full h-screen">
      {/* header */}
      <div className="w-full border-b pb-5">
        <div className="p-5">
          <div className="flex gap-5">
            <button
              className="p-2 rounded-full"
              onClick={() => closeModal("contact")}
            >
              <FaArrowLeft className="cursor-pointer" />
            </button>
            <h1 className="text-xl font-medium">Select contact</h1>
          </div>
        </div>
        <div className="search-chats relative flex justify-center">
          <input
            type="text"
            className="w-11/12 p-3 px-10 bg-[#e4eef3] outline-none rounded-xl"
            placeholder="Search settings"
          />
          <FaSearch className="absolute top-4 left-8 cursor-pointer" />
        </div>
      </div>
      {/* contacts list */}
      <div className="w-full max-h-96 p-5 gap-5  flex flex-col overflow-y-auto">
        {/* <div className="options w-full">
          <div>

          </div>
        </div> */}
        <h4 className="text-md font-medium text-slate-500">
          All contact on seechat
        </h4>
        {/* contacts list */}
        {allContacts.map((user) => (
          <div
            key={user._id}
            className="flex gap-5 items-center cursor-pointer"
            onClick={() => handleStartChat(user)}
          >
            <img
              src={user.profilePic || "/avatar.png"}
              alt=""
              className="size-14 rounded-full shadow-lg shadow-slate-300"
            />
            <div>
              <h4 className="name text-base font-semibold">{user.name}</h4>
              <h5 className="about text-xs">{user.about}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
