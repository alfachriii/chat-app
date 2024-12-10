import { IoCamera, IoSendSharp } from "react-icons/io5";
import ContactInfo from "./ContactInfo";
import { useChatStore } from "../store/chat.store";
import { useModalStore } from "../store/modal.store";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/auth.store";
import { formatMessageTime } from "../lib/utils";

const Chat = () => {
  const { selectedUser, messages, getMessages, sendMessage } = useChatStore();
  const { openModal, modals } = useModalStore();
  const { authUser } = useAuthStore();
  const contactInfoModel = modals.find(
    (modal) => modal.modalId === "contact-info"
  );

  useEffect(() => {
    getMessages(selectedUser._id);
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  const fileInputRef = useRef(null);

  const [inputFile, setInputFile] = useState(null)
  const [inputMessage, setInputMessage] = useState("");

  const handleInputFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 21000000) return toast.error("Max file size 20MB");

    const reader = new FileReader();

    reader.onloadend = async () => {
      setInputFile(reader.result)
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage && !inputMessage) return;

    await sendMessage(inputMessage, inputFile, selectedUser._id);
  };


  if (!selectedUser) return null;

  return (
    <>
      {contactInfoModel ? (
        <ContactInfo />
      ) : (
        <div className="w-full h-full border-l flex flex-col">
          {/* Header */}
          <div
            className="w-full p-4 px-5 border-b cursor-pointer"
            onClick={() => openModal("contact-info")}
          >
            <div className="flex items-center gap-5">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt=""
                className="rounded-full size-12"
              />
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold">{selectedUser.name}</h4>
                <h3 className="status text-xs text-slate-600">Online</h3>
              </div>
            </div>
          </div>
          {/* Chat container */}
          <div className="w-full h-full overflow-y-auto space-y-4 bg-sky-50 p-5">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    message.senderId === authUser._id
                      ? "bg-sky-200"
                      : "bg-[#e4eef3]"
                  } text-slate-700`}
                >
                  {message.file && <img src={message.file.url} className="size-72 mt-2 mb-2" />}
                  {message.text && (
                    <p className="text-sm z-10 break-words text-start w-full flex items-center justify-between">
                      {message.text}{" "}
                      <span className="ml-2 mt-2 text-[10px] font-medium">
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Chat Input */}
          <div className="text w-full h-24 pb-1 border-t-2 flex justify-center gap-5 items-center">
            <div className="relative w-10/12">
              <input
                type="text"
                placeholder="Type a message"
                value={inputMessage.text}
                onChange={(e) => setInputMessage(e.target.value)}
                className="p-3 outline-none w-full rounded-md"
              />
              <input
                id="input-file-message"
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleInputFile}
              />
              <button onClick={() => fileInputRef.current.click()}>
                <IoCamera className="absolute top-2 right-3 text-3xl" />
              </button>
            </div>
            <button onClick={handleSendMessage}>
              <IoSendSharp className="text-2xl text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
