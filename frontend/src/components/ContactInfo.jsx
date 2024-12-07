import pp from "../assets/gua.jpeg";
import { IoClose } from "react-icons/io5";
import { useAuthStore } from "../store/auth.store";

// eslint-disable-next-line react/prop-types
const ContactInfo = ({ onClose }) => {
  const { showProfilePicModal } = useAuthStore();

  return (
    <div className="w-full min-h-screen bg-[#e4eef3] border-l overflow-y-auto">
      {/* header */}
      <div className="w-full h-16 flex gap-4 px-4 items-center bg-sky-50">
        <button onClick={onClose}>
          <IoClose className="text-2xl" />
        </button>
        <h4 className="font-medium">Contact Info</h4>
      </div>
      {/* Contact */}
      <div className="w-full p-5 flex flex-col items-center bg-sky-50">
        <img src={pp} alt="" className="size-60 rounded-full cursor-pointer" onClick={showProfilePicModal}/>
        <div className="mt-4">
          <h4 className="text-center text-xl font-semibold">al fachri</h4>
          <h5 className="text-center text-slate-500">al@email.com</h5>
        </div>
      </div>
      {/* About */}
      <div className="w-full px-4 bg-sky-50 p-5 mt-5">
        <h5 className="text-slate-600">About</h5>
        <h4 className="text-slate-800 text-lg">
          Hey there! I am using seechat
        </h4>
      </div>
    </div>
  );
};

export default ContactInfo;
