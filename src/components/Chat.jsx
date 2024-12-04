import pp from "../assets/gua.jpeg";
import { IoSendSharp } from "react-icons/io5";

const Chat = () => {
  return (
    <div className="w-full h-full border-l flex flex-col">
      <div className="w-full p-4 px-5 border-b">
        <div className="flex items-center gap-5">
          <img src={pp} alt="" className="rounded-full size-12" />
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold">John Doe</h4>
            <h3 className="text-xs text-slate-600">Online</h3>
          </div>
        </div>
      </div>
      <div className="w-full h-full bg-sky-50"></div>
      <div className="text w-full h-24 pb-1 border-t-2 flex justify-around items-center">
        <input type="text" placeholder="Type a message" className="p-3 outline-none w-10/12 rounded-md"/>
        <IoSendSharp className="text-2xl text-slate-600 cursor-pointer"/>
      </div>
    </div>
  );
};

export default Chat;
