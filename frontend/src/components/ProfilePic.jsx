import { IoClose } from "react-icons/io5";
import pp from "../assets/gua.jpeg";
import { useAuthStore } from "../store/auth.store";

const ProfilePic = () => {
  const { profilePicModal, closeProfilePicModal } = useAuthStore();

  if (!profilePicModal) return null;
  return (
    <div className="absolute top-0 right-0 w-screen h-screen bg-sky-50 bg-opacity-90 flex flex-col z-50">
      {/* header */}
      <div className="w-full h-10 p-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <img src={pp} alt="" className="size-12 rounded-full" />
          <h4 className="font-medium text-lg">al</h4>
        </div>
        <button className="p-2 rounded-full" onClick={closeProfilePicModal}>
          <IoClose className="text-2xl" />
        </button>
      </div>
      <div className="w-full h-full flex justify-center">
        <img src={pp} alt="" className="size-96 mt-10" />
      </div>
    </div>
  );
};

export default ProfilePic;
