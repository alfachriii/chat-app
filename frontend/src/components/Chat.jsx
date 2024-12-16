import { IoCamera, IoClose, IoSendSharp } from "react-icons/io5";
import ContactInfo from "./ContactInfo";
import { useChatStore } from "../store/chat.store";
import { useModalStore } from "../store/modal.store";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/auth.store";
import { formatMessageTime } from "../lib/utils";
import ReactPlayer from "react-player";

const Chat = () => {
  const { selectedUser, messages, getMessages, sendMessage, isOnline, subscribeToChat, unsubscribeFromChat } = useChatStore();
  const { openModal, modals } = useModalStore();
  const { authUser, socket } = useAuthStore();
  const contactInfoModel = modals.find(
    (modal) => modal.modalId === "contact-info"
  );
  const messageEndRef = useRef(null);
  const inputMessageRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToChat()

    return () => unsubscribeFromChat();
     
  }, [selectedUser, getMessages, subscribeToChat, unsubscribeFromChat]);

  useEffect(() => {
    socket?.emit("checkStatus", selectedUser._id)
  }, [selectedUser._id, socket])

  // useEffect(() => {
  //   const handleFocus = () => {
  //     if (!socket || socket.connected) return;
  //     connectSocket();
  //   };

  //   // Mendiskonekkan socket saat halaman kehilangan fokus
  //   const handleBlur = () => {
  //     if (socket && socket.connected) {
  //       socket.disconnect();
  //     }
  //   };

  //   // Menangani event focus dan blur
  //   window.addEventListener("focus", handleFocus);
  //   window.addEventListener("blur", handleBlur);

  //   // Menghubungkan socket saat komponen dimuat
  //   connectSocket();

  //   // Membersihkan event listener saat komponen dibersihkan
  //   return () => {
  //     window.removeEventListener("focus", handleFocus);
  //     window.removeEventListener("blur", handleBlur);
  //     if (socket) {
  //       socket.disconnect();
  //     }
  //   };
  // }, [connectSocket, socket])

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fileInputRef = useRef(null);

  const [inputFile, setInputFile] = useState("");
  const [typeFile, setTypeFile] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  const handleInputFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 21000000) return toast.error("Max file size 20MB");

    setTypeFile(file.type.split("/")[0]);

    const reader = new FileReader();

    reader.onloadend = async () => {
      setInputFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage && !inputFile) return;

    // if (inputMessageRef.current) {
    //   inputMessageRef.current.focus();
    // }

    await sendMessage(inputMessage, inputFile, selectedUser._id);
    inputMessageRef.current.value = inputMessageRef.current.defaultValue;
    setInputFile("");
    setInputMessage("");
  };

  console.log(isOnline)
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
                <h3 className="status text-xs text-slate-600">{isOnline ? "Online" : `${selectedUser.lastSeen}`}</h3>
              </div>
            </div>
          </div>
          {/* Chat container */}
          <div className="w-full h-full overflow-y-auto space-y-4 bg-sky-50 p-5">
            {!messages.lenght < 1 ? (
              <p className="text-xs text-slate-400 text-center">
                Start new message.
              </p>
            ) : null}
            {messages.map((message) => (
              <div
                key={message._id}
                ref={messageEndRef}
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
                  {" "}
                  {message?.file?.sentAs === "video" && (
                    <div>
                      <ReactPlayer
                        url={message.file.url}
                        controls={true} // show controls
                        width="375px"
                        height="250px"
                      />
                    </div>
                  )}
                  {message?.file?.sentAs === "image" && (
                    <img src={message.file.url} className="size-72 mt-2 mb-2" />
                  )}
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
          <div className="relative text w-full min-h-20 pb-1 border-t-2 flex flex-col justify-center">
            {inputFile && (
              <div className="absolute -top-72 left-5  p-4 flex flex-col items-end bg-[#e4eef3] animate-flip-up animate-duration-[500ms]">
                <button onClick={() => setInputFile("")}>
                  <IoClose className="text-2xl mb-2" />
                </button>
                <div className="bg-sky-50 size-56 flex justify-center items-center">
                  {typeFile === "image" ? (
                    <img src={inputFile} alt="" className="w-auto h-56" />
                  ) : (
                    <div className="w-auto h-56">
                      <video
                        src={inputFile}
                        className="w-full h-full"
                        controls={true}
                      ></video>
                    </div>
                  )}
                </div>
              </div>
            )}
            <form
              action=""
              className="w-full flex justify-center gap-5 items-center"
              onSubmit={handleSendMessage}
            >
              <div className="relative w-10/12">
                <input
                  type="text"
                  ref={inputMessageRef}
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
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                >
                  <IoCamera className="absolute top-2 right-3 text-3xl" />
                </button>
              </div>
              <button type="submit">
                <IoSendSharp className="text-2xl text-slate-600" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
