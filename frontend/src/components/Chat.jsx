import { IoSendSharp } from "react-icons/io5";
import { BsChatRightFill } from "react-icons/bs";
import ContactInfo from "./ContactInfo";
import { useState } from "react";
import { useChatStore } from "../store/chat.store";

const Chat = () => {
  const { selectedUser } = useChatStore()
  const [showContactInfo, setShowContactInfo] = useState(false);
  const closeContactInfo = () => setShowContactInfo(false)

  return (
    <>
      {showContactInfo ? (
        <ContactInfo onClose={closeContactInfo}/>
      ) : (
        <div className="w-full h-full border-l flex flex-col">
          {/* Header */}
          <div className="w-full p-4 px-5 border-b cursor-pointer" onClick={() => setShowContactInfo(true)}>
            <div className="flex items-center gap-5">
              <img src={selectedUser.profilePic || "/avatar.png"} alt="" className="rounded-full size-12" />
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold">{selectedUser.name}</h4>
                <h3 className="status text-xs text-slate-600">Online</h3>
              </div>
            </div>
          </div>
          {/* Chat container */}
          <div className="w-full h-full overflow-y-auto space-y-4 bg-sky-50 p-5">
            <div className="other relative ml-0 max-w-md p-3 px-5 rounded-md w-fit h-fit bg-[#e4eef3]">
              <BsChatRightFill className="absolute rotate-90 bottom-0 -left-1 text-[#e4eef3]" />
              <p className="text-sm z-10 break-words text-start">
                anj{" "}
                <span className="ml-2 text-[10px] font-medium">04:78 PM</span>
              </p>
            </div>

            <div className="sender relative ml-auto max-w-md p-3 px-5 rounded-md w-fit h-fit bg-sky-200">
              <BsChatRightFill className="absolute -rotate-90 top-0 -right-1 text-sky-200" />
              <p className="text-sm z-10 break-words text-end">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                optio dolor totam accusantium, illo similique unde odio nobis
                quod modi.{" "}
                <span className="ml-2 text-[10px] font-medium">04:78 PM</span>
              </p>
            </div>
            <div className="sender relative ml-auto max-w-md p-3 px-5 rounded-md w-fit h-fit bg-sky-200">
              <BsChatRightFill className="absolute -rotate-90 top-0 -right-1 text-sky-200" />
              <p className="text-sm z-10 break-words text-end">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                optio dolor totam accusantium, illo similique unde odio nobis
                quod modi.{" "}
                <span className="ml-2 text-[10px] font-medium">04:78 PM</span>
              </p>
            </div>
            <div className="sender relative ml-auto max-w-md p-3 px-5 rounded-md w-fit h-fit bg-sky-200">
              <BsChatRightFill className="absolute -rotate-90 top-0 -right-1 text-sky-200" />
              <p className="text-sm z-10 break-words text-end">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                optio dolor totam accusantium, illo similique unde odio nobis
                quod modi.{" "}
                <span className="ml-2 text-[10px] font-medium">04:78 PM</span>
              </p>
            </div>
            <div className="sender relative ml-auto max-w-md p-3 px-5 rounded-md w-fit h-fit bg-sky-200">
              <BsChatRightFill className="absolute -rotate-90 top-0 -right-1 text-sky-200" />
              <p className="text-sm z-10 break-words text-end">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                optio dolor totam accusantium, illo similique unde odio nobis
                quod modi.{" "}
                <span className="ml-2 text-[10px] font-medium">04:78 PM</span>
              </p>
            </div>
            <div className="sender relative ml-auto max-w-md p-3 px-5 rounded-md w-fit h-fit bg-sky-200">
              <BsChatRightFill className="absolute -rotate-90 top-0 -right-1 text-sky-200" />
              <p className="text-sm z-10 break-words text-end">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                optio dolor totam accusantium, illo similique unde odio nobis
                quod modi.{" "}
                <span className="ml-2 text-[10px] font-medium">04:78 PM</span>
              </p>
            </div>
            
          </div>
          {/* Chat Input */}
          <div className="text w-full h-24 pb-1 border-t-2 flex justify-around items-center">
            <input
              type="text"
              placeholder="Type a message"
              className="p-3 outline-none w-10/12 rounded-md"
            />
            <IoSendSharp className="text-2xl text-slate-600 cursor-pointer" />
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
