import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    console.log(success)
    if (success === true) signup(formData);
  };

  return (
    <div className="w-screen h-screen bg-slate-100 flex justify-center items-center text-slate-700">
      <div className="bg-slate-50 w-1/3 h-fit p-5 flex flex-col items-center">
        <div className="p-4 rounded-md bg-sky-100 mb-2">
          <FiMessageSquare className="text-2xl" />
        </div>
        <h1 className="font-bold text-2xl">Create Account</h1>
        <h3 className="text-sm font-normal">
          Get started with your free account
        </h3>
        <form className="mt-5 flex flex-col" onSubmit={handleSubmit}>
          <label className="label">
            <span className="text-sm font-semibold ml-2">Name</span>
          </label>
          <input
            type="text"
            placeholder="yourname"
            className="w-96 p-2 py-3 text-sm border-none outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label className="label mt-3">
            <span className="text-sm font-semibold ml-2">Email</span>
          </label>
          <input
            type="email"
            placeholder="example@example.com"
            className="w-96 p-2 py-3 text-sm border-none outline-none"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <label className="label mt-3">
            <span className="text-sm font-semibold ml-2">Password</span>
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="**********"
              className="w-96 p-2 py-3 text-sm border-none outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute top-3 right-3"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          <button
            type="submit"
            className="mt-4 bg-sky-300 p-4 text-sm font-semibold rounded flex justify-center"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <span className="loading loading-dots loading-sm"></span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <div className="mt-6 text-xs flex gap-1">
          <h3>Already have an account.</h3>
          <Link
            to="/login"
            className="text-sky-900 underline underline-offset-1"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
