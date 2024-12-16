import {
  FaArrowLeft,
  FaCheck,
  FaRegFolderOpen,
  FaRegTrashAlt,
} from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { IoCamera } from "react-icons/io5";
import { useAuthStore } from "../../store/auth.store";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRef } from "react";

// eslint-disable-next-line react/prop-types
const Profile = ({ isOpen, onClose }) => {
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const {
    authUser,
    showProfilePicModal,
    updateName,
    updateAbout,
    updateProfilePic,
    deleteProfilePic,
    isUpdateProfile,
  } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleShowProfilePic = () => {
    if (!authUser.profilePic)
      return toast.error("No photo profile", { duration: 1000 });
    showProfilePicModal();
  };

  const handleImageUpload = async (e) => {
    let imageFile = e.target.files[0];
    if (!imageFile) return;

    if (imageFile.size > 2005000) return toast.error("Max file size 2MB");

    const reader = new FileReader();

    reader.readAsDataURL(imageFile);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfilePic({ profilePic: base64Image });
    };

    imageFile = null;
  };

  const handleDeleteProfilePic = () => {
    deleteProfilePic();
    setSelectedImg("/avatar.png");
  };

  // update name
  const [formName, setFormName] = useState("");
  const handleSubmitName = async (e) => {
    e.preventDefault();
    if(!formName) return toast.error("Name must not be empty")
    await updateName(formName);
  };

  // update about
  const [formAbout, setFormAbout] = useState("")
  const handleSubmitAbout = async (e) => {
    e.preventDefault();
    if(!formAbout) return toast.error("About must not be empty")
    await updateAbout(formAbout);
  };

  if (!isOpen) return null;
  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex justify-between p-5">
        <div className="flex items-center gap-5">
          <button onClick={onClose} className="p-2 rounded-full">
            <FaArrowLeft className="cursor-pointer" />
          </button>
          <h1 className="text-xl font-medium">Profile</h1>
        </div>
      </div>
      <div className="max-h-[560px] overflow-y-auto">
        <div className="w-full flex py-7 items-center justify-center bg-[#e4eef3]">
          <div className="relative">
            <button
              onClick={handleShowProfilePic}
              className="relative size-44 rounded-full shadow-lg shadow-slate-300"
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt=""
                className="size-44 rounded-full"
              />
              {isUpdateProfile ? (
                <div className="absolute top-0 right-0 size-full flex items-center justify-center rounded-full bg-slate-500 opacity-80 animate-pulse"></div>
              ) : null}
            </button>
            <div className="relative">
              <button
                className="absolute bottom-0 right-0 p-2 rounded-full bg-sky-50 cursor-pointer"
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                
              >
                <IoCamera className="text-3xl text-sky-600" />
              </button>
              {showPhotoOptions ? (
                <div className="absolute -right-36 bottom-0 space-y-2 py-3 bg-sky-50 shadow-md shadow-slate-400">
                  <button
                    className="flex gap-2 px-2"
                    onClick={handleShowProfilePic}
                    // onClick={() => fileInputRef.current.click()}
                  >
                    <GrView className="text-xl" />
                    <p>View photo</p>
                  </button>
                  <div className="flex gap-2 px-2 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <FaRegFolderOpen className="text-xl"/>
                    <input
                      type="file"
                      ref={fileInputRef}
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdateProfile}
                    />
                    <button>Upload photo</button>
                  </div>
                  <button
                    className="flex gap-2 px-2 pt-2 border-t border-slate-400"
                    onClick={handleDeleteProfilePic}
                  >
                    <FaRegTrashAlt className="text-xl" />
                    <p>Delete photo</p>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="name relative">
          <form
            action=""
            className="flex flex-col p-5 px-7 gap-5"
            onSubmit={handleSubmitName}
          >
            <label>
              <span className="font-medium text-sky-600">Your name</span>
            </label>
            <div>
              <input
                type="text"
                placeholder={authUser.name}
                value={formName || authUser.name}
                onChange={(e) => setFormName(e.target.value)}
                className="w-11/12 placeholder:text-slate-700 bg-transparent outline-none"
              />
              {isUpdateProfile && <div className="absolute left-5 top-16 w-4/5 bg-slate-300 opacity-10 animate-pulse">sata</div>}
              <button type="submit">
                <FaCheck />
              </button>
            </div>
            <span className="text-xs text-slate-500">
              This is not your username or PIN. This name will be visible to
              your seechat contacts.
            </span>
          </form>
        </div>
        <div className="about relative">
          <form action="" className="flex flex-col p-5 px-7 gap-5" onSubmit={handleSubmitAbout}>
            <label>
              <span className="font-medium text-sky-600">About</span>
            </label>
            <div>
              <input
                type="text"
                placeholder={authUser.about}
                value={formAbout || authUser.about}
                onChange={(e) => setFormAbout(e.target.value) }
                className="w-11/12 placeholder:text-slate-700 bg-transparent outline-none"
              />
              {isUpdateProfile && <div className="absolute left-5 top-16 w-4/5 bg-slate-300 opacity-10 animate-pulse">sata</div>}
              <button type="submit">
                <FaCheck />
              </button>
            </div>
          </form>
        </div>
        <div className="email flex flex-col p-5 px-7 gap-5">
          <label>
            <span className="font-medium text-sky-600">Email</span>
          </label>
          <div>
            <input
              type="text"
              placeholder={authUser.email}
              className="w-11/12 placeholder:text-slate-500 bg-transparent outline-none"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
