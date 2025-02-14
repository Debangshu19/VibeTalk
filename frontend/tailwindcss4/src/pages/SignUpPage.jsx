import { useState } from "react";
import { useAuthStore } from "../store/AuthUser";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const { signup, isSigningUp } = useAuthStore();

  const handleSignUp = (e) => {
		e.preventDefault();
        console.log(email, fullName, password);
		signup({email, fullName, password});
	};

  return (
    <div className="min-h-screen grid lg:grid-cols-2 mt-5">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <br />
              <div className="relative mt-2 p-3 border-2 border-white rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-gray-400" /> {/* Adjusted icon color */}
                </div>
                <input
                  type="text"
                  className="w-full pl-10 bg-transparent text-white outline-none focus:ring-0 focus:border-transparent"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}></input>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <br />
              <div className="relative mt-2 p-3 border-2 border-white rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-gray-400" /> {/* Adjusted icon color */}
                </div>
                <input
                  type="text"
                  className="w-full pl-10 bg-transparent text-white outline-none focus:ring-0 focus:border-transparent"
                  placeholder="John Doe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}></input>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <br />
              <div className="relative mt-2 p-3 border-2 border-white rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-gray-400" /> {/* Adjusted icon color */}
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 bg-transparent text-white outline-none focus:ring-0 focus:border-transparent"
                  placeholder="John Doe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}></input>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-md bg-white text-black font-semibold flex items-center justify-center gap-2 
                hover:bg-gray-200 transition-colors duration-200 
                disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed`}
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};
export default SignUpPage;