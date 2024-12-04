import intro from "../assets/intro.svg";

const Intro = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <img src={intro} alt="" className="size-1/3" />
      <div className="font-medium">
        <h3 className="text-center text-2xl font-semibold mb-2">seechat.</h3>
        <h4 className="text-slate-500 text-sm">
          Bringing the distant closer, uniting stories in one chat space.
        </h4>
        <h4 className="text-slate-500 text-sm">
        More than just chatting, it&apos;s about meaningful connections.
        </h4>
      </div>
    </div>
  );
};

export default Intro;
