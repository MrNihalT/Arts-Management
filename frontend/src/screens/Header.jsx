import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    selectUser,
    selectIsAuthenticated,
    logoutUser,
} from "../features/auth/authSlice";

const ROLE_DASHBOARDS = {
    admin: { label: "Admin Dashboard", path: "/admin" },
    principal: { label: "Principal Dashboard", path: "/principal" },
    vice_principal: { label: "VP Dashboard", path: "/vice-principal" },
    teacher: { label: "Teacher Dashboard", path: "/teacher" },
    judge: { label: "Judge Dashboard", path: "/judge" },
    student: { label: "Student Dashboard", path: "/student" },
};

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuthenticated);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate("/login");
    };

    // Hide on auth pages
    const authPages = ["/login", "/register"];
    if (authPages.includes(location.pathname)) return null;

    const navLinks = [
        { name: "HOME", path: "/" },
        { name: "EVENTS", path: "/events" },
        { name: "SCHEDULE", path: "/schedule" },
        { name: "RESULTS", path: "/results" },
        { name: "GALLERY", path: "/gallery" },
        { name: "CONTACT", path: "/contact" },
    ];

    if (
        user?.role === "admin" ||
        user?.role === "principal" ||
        user?.role === "vice_principal"
    ) {
        navLinks.push({ name: "ADMIN", path: "/admin" });
    } else if (user?.role === "teacher") {
        navLinks.push({ name: "TEACHER", path: "/teacher" });
    } else if (user?.role === "judge") {
        navLinks.push({ name: "JUDGE", path: "/judge" });
    } else {
        console.log("hi");
    }

    return (
        <header className="sticky top-0 z-50 bg-[#0B0B13] border-b border-white/5 py-5 px-6 lg:px-12">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex mr-2 flex-col no-underline group">
                    <div className="flex  items-baseline gap-2">
                        <span className="text-white text-3xl font-black tracking-widest leading-none">
                            KALĀ
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 text-3xl font-black leading-none">
                            2026
                        </span>
                    </div>
                    <span className="text-white text-[0.6rem] font-bold tracking-[0.25em] mt-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        THE COLLEGE ARTS FEST
                    </span>
                </Link>

                {/* Nav Links */}
                <nav className="hidden lg:flex  items-center gap-7">
                    {navLinks.map((link) => {
                        const isActive =
                            location.pathname === link.path ||
                            (link.path === "/" && location.pathname === "");
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[0.75rem] font-bold tracking-wider relative pb-1 transition-colors ${isActive ? "text-pink-500" : "text-gray-300 hover:text-white"}`}
                            >
                                {link.name}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Register Button & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/account")}
                        className="text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate("/announcement")}
                        className="text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </button>
                    {!isAuth ? (
                        <Link
                            to="/login"
                            className="hidden sm:block bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold px-7 py-3 rounded-full tracking-wider hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all"
                        >
                            LOGIN
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="hidden sm:block bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold px-7 py-3 rounded-full tracking-wider hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all"
                        >
                            LOGOUT
                        </button>
                    )}
                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-white p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {menuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <div
                className={`lg:hidden absolute top-full left-0 w-full
                bg-[#0B0B13] border-b border-white/10 py-4 px-6 flex flex-col
                gap-4 shadow-xl transform transition-all duration-300 ease-in-out
                ${
                    menuOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-5 pointer-events-none"
                }`}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setMenuOpen(false)}
                        className="text-sm font-bold tracking-wider text-gray-300"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </header>
    );
}
