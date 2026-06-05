import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div className="bg-[#0B0B13] min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
            <div className="relative z-10 max-w-2xl w-full px-6 text-center">
                <h1 className="text-[12rem] md:text-[16rem] font-black leading-none m-0 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-orange-400 to-pink-600 drop-shadow-[0_0_35px_rgba(236,72,153,0.3)]">
                    404
                </h1>

                <div className="mt-[-2rem] md:mt-[-4rem]">
                    <div className="bg-[#11111A]/60 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl inline-block w-full">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase mb-4">
                            LOST IN THE ARTS?
                        </h2>
                        <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto leading-relaxed mb-10">
                            The masterpiece you're looking for doesn't exist or
                            has been moved to another gallery.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <Link
                                to="/"
                                className="bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold px-10 py-4 rounded-full tracking-widest hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-105 transition-all flex items-center gap-3 group"
                            >
                                <svg
                                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    ></path>
                                </svg>
                                RETURN TO FESTIVAL
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="mt-12 flex items-center justify-center gap-4 opacity-30">
                    <div className="h-px w-12 bg-white"></div>
                    <span className="text-white font-bold tracking-[0.3em] text-xs">
                        KALĀ 2026
                    </span>
                    <div className="h-px w-12 bg-white"></div>
                </div>
            </div>
        </div>
    );
}
