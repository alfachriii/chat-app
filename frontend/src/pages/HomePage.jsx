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
  const { connectSocket, disconnectSocket } = useAuthStore()
  const { selectedUser, setSelectedUser, getRecentMessages, recentMessages } = useChatStore();
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
        connectSocket()
        // Logika ketika tab aktif
      } else {
        disconnectSocket()
        // Logika ketika tab tidak aktif
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean-up event listener
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    connectSocket()

    getRecentMessages()

    return
  }, [connectSocket, getRecentMessages]);
  
  console.log(recentMessages)

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
