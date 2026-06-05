import { Link } from "react-router-dom";
import bg from "../assets/images/bg.png";
import { selectUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
export default function Home() {
    const user = useSelector(selectUser);
    return (
        <div className="bg-[#0B0B13] min-h-screen text-white font-sans overflow-x-hidden">
            {/* Spotlight / Hero Section */}
            <section
                style={{ backgroundImage: `url(${bg})` }}
                className="bg-no-repeat bg-cover bg-center relative pt-20 pb-32 px-6 lg:px-12 flex flex-col items-center justify-center min-h-[85vh] overflow-hidden"
            >
                <div className=" relative z-20 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col items-start gap-6">
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-4 mb-2">
                                <h1 className="text-7xl md:text-8xl font-black tracking-widest leading-none text-white m-0">
                                    KALĀ
                                </h1>
                                <span className="text-6xl md:text-8xl font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
                                    2026
                                </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold tracking-[0.25em] text-white m-0">
                                THE COLLEGE ARTS FEST
                            </h2>
                        </div>

                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-300 text-3xl md:text-4xl italic font-serif mt-2">
                            Unleash. Express. Inspire.
                        </p>

                        <p className="text-gray-300 text-lg max-w-lg leading-relaxed">
                            A celebration of creativity, talent and culture.
                            <br />
                            Join the most vibrant arts festival.
                        </p>
                        {!user && (
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                <Link
                                    to="/login"
                                    className="bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold px-8 py-3.5 rounded-full tracking-wider hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all flex items-center gap-2"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                        ></path>
                                    </svg>
                                    LOGIN
                                </Link>
                            </div>
                        )}

                        <div className="flex items-center gap-4 mt-6">
                            {[
                                // Insta
                                <svg
                                    key="1"
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>,
                                // FB
                                <svg
                                    key="2"
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>,
                                // YouTube
                                <svg
                                    key="3"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 002.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>,
                                // Twitter
                                <svg
                                    key="4"
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>,
                                // Email
                                <svg
                                    key="5"
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>,
                            ].map((icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white hover:border-pink-500 hover:bg-pink-500/10 transition-all"
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:flex justify-end items-center relative">
                        <div className="relative w-80 h-80 flex items-center justify-center rounded-full border-2 border-pink-500/30 overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.2)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-orange-500/10 mix-blend-overlay"></div>
                            <span className="text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-pink-200 opacity-90 drop-shadow-2xl">
                                K
                            </span>
                        </div>
                    </div>
                </div>
                <div className="relative z-30 max-w-[1200px] w-full mx-auto mt-20 -mb-24">
                    <div className="bg-[#11111A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-8 shadow-2xl">
                        <div className="flex items-center gap-4 flex-1 justify-center lg:justify-start">
                            <svg
                                className="w-8 h-8 text-pink-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                            </svg>
                            <div>
                                <h3 className="text-3xl font-black text-white m-0">
                                    4
                                </h3>
                                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase m-0 mt-1">
                                    Days
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:block w-px h-12 bg-white/10"></div>
                        <div className="flex items-center gap-4 flex-1 justify-center">
                            <svg
                                className="w-8 h-8 text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                ></path>
                            </svg>
                            <div>
                                <h3 className="text-3xl font-black text-white m-0">
                                    50+
                                </h3>
                                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase m-0 mt-1">
                                    Events
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:block w-px h-12 bg-white/10"></div>
                        <div className="flex items-center gap-4 flex-1 justify-center">
                            <svg
                                className="w-8 h-8 text-pink-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                ></path>
                            </svg>
                            <div>
                                <h3 className="text-3xl font-black text-white m-0">
                                    2000+
                                </h3>
                                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase m-0 mt-1">
                                    Participants
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:block w-px h-12 bg-white/10"></div>
                        <div className="flex items-center gap-4 flex-1 justify-center lg:justify-end">
                            <svg
                                className="w-8 h-8 text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                ></path>
                            </svg>
                            <div>
                                <h3 className="text-2xl font-black text-white m-0 leading-tight">
                                    COUNTLESS
                                </h3>
                                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase m-0 mt-1">
                                    Memories
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="px-6 lg:px-12 max-w-[1400px] mx-auto mt-28 mb-16 relative z-20">
                <div className="bg-[#11111A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 xl:gap-6">
                        {/* Event */}
                        <div className="flex flex-col h-full gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors group border border-transparent hover:border-white/5">
                            <div className="flex items-start gap-4">
                                <svg
                                    className="w-10 h-10 text-pink-500 shrink-0 mt-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                    ></path>
                                </svg>
                                <div>
                                    <h4 className="text-white font-bold tracking-wider m-0 text-sm group-hover:text-pink-400 transition-colors">
                                        EVENTS
                                    </h4>
                                    <p className="text-gray-400 text-xs leading-relaxed mt-1">
                                        Explore all events and activities
                                    </p>
                                </div>
                            </div>
                            <div className="mt-auto pt-2">
                                <Link
                                    to="/events"
                                    className="text-pink-500 hover:text-pink-400 text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-colors w-fit"
                                >
                                    EXPLORE{" "}
                                    <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                        {/* Schedule */}
                        <div className="flex flex-col h-full gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors group border border-transparent hover:border-white/5">
                            <div className="flex items-start gap-4">
                                <svg
                                    className="w-10 h-10 text-purple-500 shrink-0 mt-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <div>
                                    <h4 className="text-white font-bold tracking-wider m-0 text-sm group-hover:text-purple-400 transition-colors">
                                        SCHEDULE
                                    </h4>
                                    <p className="text-gray-400 text-xs leading-relaxed mt-1">
                                        Check live schedule and running order
                                    </p>
                                </div>
                            </div>
                            <div className="mt-auto pt-2">
                                <Link
                                    to="/schedule"
                                    className="text-purple-500 hover:text-purple-400 text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-colors w-fit"
                                >
                                    VIEW SCHEDULE{" "}
                                    <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                        {/* Results */}
                        <div className="flex flex-col h-full gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors group border border-transparent hover:border-white/5">
                            <div className="flex items-start gap-4">
                                <svg
                                    className="w-10 h-10 text-pink-400 shrink-0 mt-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    ></path>
                                </svg>
                                <div>
                                    <h4 className="text-white font-bold tracking-wider m-0 text-sm group-hover:text-pink-300 transition-colors">
                                        RESULTS
                                    </h4>
                                    <p className="text-gray-400 text-xs leading-relaxed mt-1">
                                        Results & winners will be updated
                                    </p>
                                </div>
                            </div>
                            <div className="mt-auto pt-2">
                                <Link
                                    to="/results"
                                    className="text-pink-400 hover:text-pink-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-colors w-fit"
                                >
                                    VIEW RESULTS{" "}
                                    <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                        {/* Gallery */}
                        <div className="flex flex-col h-full gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors group border border-transparent hover:border-white/5">
                            <div className="flex items-start gap-4">
                                <svg
                                    className="w-10 h-10 text-pink-600 shrink-0 mt-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    ></path>
                                </svg>
                                <div>
                                    <h4 className="text-white font-bold tracking-wider m-0 text-sm group-hover:text-pink-500 transition-colors">
                                        GALLERY
                                    </h4>
                                    <p className="text-gray-400 text-xs leading-relaxed mt-1">
                                        Moments captured, memories forever
                                    </p>
                                </div>
                            </div>
                            <div className="mt-auto pt-2">
                                <Link
                                    to="/gallery"
                                    className="text-pink-600 hover:text-pink-500 text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-colors w-fit"
                                >
                                    VIEW GALLERY{" "}
                                    <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                        {/* Sponsors */}
                        <div className="flex flex-col h-full gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors group border border-transparent hover:border-white/5 lg:col-span-1 sm:col-span-2">
                            <div className="flex items-start gap-4">
                                <svg
                                    className="w-10 h-10 text-purple-400 shrink-0 mt-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    ></path>
                                </svg>
                                <div>
                                    <h4 className="text-white font-bold tracking-wider m-0 text-sm group-hover:text-purple-300 transition-colors">
                                        SPONSORS
                                    </h4>
                                    <p className="text-gray-400 text-xs leading-relaxed mt-1">
                                        Our supporters, our strength
                                    </p>
                                </div>
                            </div>
                            <div className="mt-auto pt-2">
                                <Link
                                    to="/sponsors"
                                    className="text-purple-400 hover:text-purple-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-colors w-fit"
                                >
                                    VIEW SPONSORS{" "}
                                    <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Announcements Section */}
            <section className="px-6 lg:px-12 max-w-[1400px] mx-auto mb-24 relative z-20">
                <div className="bg-gradient-to-br from-[#11111A]/90 to-[#0A0A10]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                        <h3 className="text-white text-xl md:text-2xl font-black tracking-widest uppercase m-0">
                            ANNOUNCEMENTS
                        </h3>
                        <Link
                            to="/announcements"
                            className="text-pink-500 hover:text-pink-400 text-sm font-bold tracking-wider uppercase flex items-center gap-1 transition-colors"
                        >
                            VIEW ALL <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Announcement 1 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer hover:bg-white/5 p-4 -mx-4 rounded-xl transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0 mt-1">
                                    <svg
                                        className="w-5 h-5 text-pink-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-pink-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            NEW
                                        </span>
                                        <h4 className="text-white font-bold text-sm md:text-base m-0 group-hover:text-pink-400 transition-colors">
                                            Registrations are now open!
                                        </h4>
                                    </div>
                                    <p className="text-gray-400 text-xs md:text-sm m-0">
                                        Hurry up and register your events.
                                    </p>
                                </div>
                            </div>
                            <div className="sm:text-right pl-14 sm:pl-0">
                                <span className="text-gray-500 text-xs font-semibold whitespace-nowrap">
                                    10 May 2026
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-white/5"></div>

                        {/* Announcement 2 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer hover:bg-white/5 p-4 -mx-4 rounded-xl transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0 mt-1">
                                    <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm md:text-base m-0 mb-1 group-hover:text-green-400 transition-colors">
                                        Schedule for Day 1 is Out!
                                    </h4>
                                    <p className="text-gray-400 text-xs md:text-sm m-0">
                                        Check the live schedule and plan ahead.
                                    </p>
                                </div>
                            </div>
                            <div className="sm:text-right pl-14 sm:pl-0">
                                <span className="text-gray-500 text-xs font-semibold whitespace-nowrap">
                                    09 May 2026
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-white/5"></div>

                        {/* Announcement 3 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer hover:bg-white/5 p-4 -mx-4 rounded-xl transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 mt-1">
                                    <svg
                                        className="w-5 h-5 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm md:text-base m-0 mb-1 group-hover:text-red-400 transition-colors">
                                        Guidelines for Participants
                                    </h4>
                                    <p className="text-gray-400 text-xs md:text-sm m-0">
                                        Please read the rules & guidelines
                                        carefully.
                                    </p>
                                </div>
                            </div>
                            <div className="sm:text-right pl-14 sm:pl-0">
                                <span className="text-gray-500 text-xs font-semibold whitespace-nowrap">
                                    07 May 2026
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
