import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    loginUser,
    selectAuthLoading,
    selectAuthError,
    selectIsAuthenticated,
    clearError,
} from "../features/auth/authSlice";

const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });

    const dispatch = useDispatch();
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(form));
    };

    return (
        <div className="min-h-screen bg-[#0B0B13] flex items-center justify-center px-4 relative overflow-hidden">
            <div className="w-full max-w-md relative z-10">
                <div className="bg-[#11111A]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 md:p-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 tracking-wider">
                            LOGIN
                        </h1>
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-3">
                            Arts Fest Portal
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
                            <p className="text-red-400 text-xs font-bold tracking-wide text-center">
                                {error.error ||
                                    "Something went wrong. Please try again."}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold tracking-wider text-gray-300 mb-2 uppercase">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter your username"
                                className="w-full bg-[#0B0B13]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold tracking-wider text-gray-300 mb-2 uppercase">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                className="w-full bg-[#0B0B13]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-500 hover:to-orange-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl tracking-wider uppercase text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        />
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[0.65rem] font-bold tracking-[0.2em] text-gray-600 mt-8 uppercase">
                    Kalā 2026 • College Arts Fest
                </p>
            </div>
        </div>
    );
};

export default Login;
