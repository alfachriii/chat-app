import Chat from "../components/Chat";
import Intro from "../components/Intro";
import ChatList from "../components/ChatList";
import ProfilePic from "../components/ProfilePic";
import { useChatStore } from "../store/chat.store";
import Contact from "../components/contacts/Contact";
import { useModalStore } from "../store/modal.store";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";

const HomePage = () => {
  const { authUser, socket, connectSocket } = useAuthStore()
  const { selectedUser, setSelectedUser, getChatListAndSaveToIndexedDb, chatList, combineDataUsers, combine } = useChatStore();
  const { modals } = useModalStore();
  const contactModal = modals.find((modal) => modal.modalId === "contact");

  useEffect(() => {
    // Fungsi untuk menangani penekanan tombol "Esc"
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        console.log("clck")
        setSelectedUser(null)
      }
    };

    // Menambahkan event listener untuk keydown
    window.addEventListener('keydown', handleEscKey);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [setSelectedUser])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Aktif")
        socket.emit("online", authUser._id)
        // Logika ketika tab aktif
      } else {
        socket.emit("offline", authUser._id)
        // Logika ketika tab tidak aktif
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean-up event listener
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [authUser._id, socket]);

  useEffect(() => {
    socket?.emit("online", authUser._id)
  }, [authUser._id, socket])

  useEffect(() => {
    connectSocket()

    getChatListAndSaveToIndexedDb()

    return
  }, [connectSocket, getChatListAndSaveToIndexedDb]);
  
  // console.log(recentMessages)

  return (
    <>
      <ProfilePic />
      <div className="w-screen h-screen flex bg-sky-50 text-slate-700">
        <div className="w-2/5 h-full">
          {contactModal ? <Contact modal={contactModal}/> : <ChatList />}
        </div>
        <div className="w-3/5 h-screen bg-[#e4eef3] text-slate-700">
          {selectedUser ? <Chat /> : <Intro />}
        </div>
      </div>
    </>
  );
};

export default HomePage;
