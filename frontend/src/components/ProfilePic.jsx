import { IoClose } from "react-icons/io5";
import { useAuthStore } from "../store/auth.store";
import { useChatStore } from "../store/chat.store";

const ProfilePic = () => {
  const {
    authUser,
    profilePicModal,
    closeProfilePicModal,
  } = useAuthStore();

  const { selectedUser } = useChatStore()

  const handleClose = () => {
    closeProfilePicModal();
  };

  let data;
  !selectedUser ? data = authUser : data = selectedUser

  if (!profilePicModal) return null;
  return (
    <div className="absolute top-0 right-0 w-screen h-screen bg-sky-50 bg-opacity-90 flex flex-col z-50">
      {/* header */}
      <div className="w-full h-10 p-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <img src={data.profilePic} alt="" className="size-12 rounded-full shadow-md shadow-slate-300" />
          <h4 className="font-medium text-lg">{data.name}</h4>
        </div>
        <button className="p-2 rounded-full" onClick={handleClose}>
          <IoClose className="text-2xl" />
        </button>
      </div>
      <div className="w-full h-full flex justify-center">
        <img src={data.profilePic} alt="" className="size-96 mt-10 shadow-lg shadow-slate-300" />
      </div>
    </div>
  );
};

export default ProfilePic;
