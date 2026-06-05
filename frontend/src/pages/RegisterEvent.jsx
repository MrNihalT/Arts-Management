import React, { useState } from "react";
import { Link } from "react-router-dom";
import bg from "../assets/images/event_bg.png";

export default function RegisterEvent() {
    const [participationType, setParticipationType] = useState("individual");

    return (
        <div className="bg-[#f8f9fa] min-h-screen font-sans pb-12">
            {/* Hero Section */}
            <section
                className="relative bg-[#0b132b] bg-cover bg-center pt-32 pb-20 px-6 lg:px-12 flex flex-col justify-center min-h-[400px]"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 max-w-[1200px] w-full mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-8 font-medium">
                        <Link
                            to="/"
                            className="hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <span>&gt;</span>
                        <span className="text-white">Register Event</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black italic tracking-wider mb-4 transform -rotate-2">
                        <span className="text-white block">REGISTER</span>
                        <span className="text-orange-500 block">
                            FOR AN EVENT
                        </span>
                    </h1>

                    <p className="text-gray-300 text-lg max-w-xl mt-6">
                        Showcase your talent. Compete with the best.{" "}
                        <br className="hidden md:block" />
                        Be a part of KALĀ 2024!
                    </p>
                </div>
            </section>

            {/* Progress Bar */}
            <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
                <div className="max-w-[1200px] mx-auto px-6 py-6 overflow-x-auto hide-scrollbar">
                    <div className="flex items-center justify-between min-w-[700px] gap-4">
                        {/* Step 1 */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#0B0B13] text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                                1
                            </div>
                            <div>
                                <p className="text-xs font-black text-[#0B0B13] tracking-wider m-0">
                                    SELECT EVENT
                                </p>
                                <p className="text-xs text-gray-500 m-0 mt-0.5">
                                    Choose your event
                                </p>
                            </div>
                        </div>
                        <div className="h-px bg-gray-300 flex-1 mx-4 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-gray-300 transform rotate-45"></div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-center gap-4 opacity-50">
                            <div className="w-12 h-12 rounded-full border-2 border-gray-300 text-gray-400 bg-white flex items-center justify-center font-bold text-lg shrink-0">
                                2
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 tracking-wider m-0">
                                    PARTICIPANT DETAILS
                                </p>
                                <p className="text-xs text-gray-400 m-0 mt-0.5">
                                    Enter participant info
                                </p>
                            </div>
                        </div>
                        <div className="h-px bg-gray-200 flex-1 mx-4 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-gray-200 transform rotate-45"></div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-center gap-4 opacity-50">
                            <div className="w-12 h-12 rounded-full border-2 border-gray-300 text-gray-400 bg-white flex items-center justify-center font-bold text-lg shrink-0">
                                3
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 tracking-wider m-0">
                                    TEAM DETAILS
                                </p>
                                <p className="text-xs text-gray-400 m-0 mt-0.5">
                                    Add team members
                                </p>
                            </div>
                        </div>
                        <div className="h-px bg-gray-200 flex-1 mx-4 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-gray-200 transform rotate-45"></div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-center gap-4 opacity-50">
                            <div className="w-12 h-12 rounded-full border-2 border-gray-300 text-gray-400 bg-white flex items-center justify-center font-bold text-lg shrink-0">
                                4
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 tracking-wider m-0">
                                    CONFIRM & SUBMIT
                                </p>
                                <p className="text-xs text-gray-400 m-0 mt-0.5">
                                    Review and submit
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="px-6 py-12 max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Form Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                            <h2 className="text-xl font-black text-[#0B0B13] tracking-widest uppercase mb-1">
                                1. SELECT EVENT
                            </h2>
                            <p className="text-gray-500 text-sm mb-10">
                                Choose the event you want to participate in.
                            </p>

                            <form className="space-y-8">
                                {/* Event Category */}
                                <div>
                                    <label className="block text-xs font-bold text-[#0B0B13] uppercase tracking-wider mb-2">
                                        EVENT CATEGORY{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                                ></path>
                                            </svg>
                                        </div>
                                        <select className="block w-full pl-12 pr-10 py-3.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 appearance-none transition-colors cursor-pointer text-gray-700">
                                            <option>Music</option>
                                            <option>Dance</option>
                                            <option>Theatre</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Event */}
                                <div>
                                    <label className="block text-xs font-bold text-[#0B0B13] uppercase tracking-wider mb-2">
                                        EVENT{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select className="block w-full pl-4 pr-10 py-3.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 appearance-none transition-colors cursor-pointer text-gray-700">
                                            <option>
                                                Surreal Strings – Solo Singing
                                            </option>
                                            <option>
                                                Band Smash – Battle of Bands
                                            </option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Participation Type */}
                                <div>
                                    <label className="block text-xs font-bold text-[#0B0B13] uppercase tracking-wider mb-2">
                                        PARTICIPATION TYPE{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                            className={`border rounded-xl p-5 cursor-pointer transition-all flex items-start gap-4 ${participationType === "individual" ? "border-[#E65038] bg-orange-50/50" : "border-gray-200 hover:border-gray-300"}`}
                                            onClick={() =>
                                                setParticipationType(
                                                    "individual",
                                                )
                                            }
                                        >
                                            <div
                                                className={`p-2 rounded-full ${participationType === "individual" ? "bg-orange-100 text-[#E65038]" : "bg-gray-100 text-gray-400"}`}
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4
                                                    className={`text-sm font-bold m-0 ${participationType === "individual" ? "text-[#E65038]" : "text-[#0B0B13]"}`}
                                                >
                                                    Individual
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1 m-0">
                                                    I am participating solo
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className={`border rounded-xl p-5 cursor-pointer transition-all flex items-start gap-4 ${participationType === "group" ? "border-[#E65038] bg-orange-50/50" : "border-gray-200 hover:border-gray-300"}`}
                                            onClick={() =>
                                                setParticipationType("group")
                                            }
                                        >
                                            <div
                                                className={`p-2 rounded-full ${participationType === "group" ? "bg-orange-100 text-[#E65038]" : "bg-gray-100 text-gray-400"}`}
                                            >
                                                <svg
                                                    className="w-6 h-6"
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
                                            </div>
                                            <div>
                                                <h4
                                                    className={`text-sm font-bold m-0 ${participationType === "group" ? "text-[#E65038]" : "text-[#0B0B13]"}`}
                                                >
                                                    Group
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1 m-0">
                                                    I am participating in a
                                                    group
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-[#0B0B13] uppercase tracking-wider mb-2">
                                        BRIEF DESCRIPTION
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">
                                        A short description about your
                                        performance (optional)
                                    </p>
                                    <textarea
                                        rows="4"
                                        className="w-full p-4 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none transition-colors"
                                        placeholder="Write something about your performance..."
                                    ></textarea>
                                    <div className="text-right text-xs text-gray-400 mt-1">
                                        0/200
                                    </div>
                                </div>

                                {/* Upload File */}
                                <div>
                                    <label className="block text-xs font-bold text-[#0B0B13] uppercase tracking-wider mb-2">
                                        UPLOAD FILE (OPTIONAL)
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">
                                        You can upload audio/video sample or any
                                        other document.
                                    </p>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <svg
                                            className="w-10 h-10 text-gray-400 group-hover:text-orange-500 transition-colors mb-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            ></path>
                                        </svg>
                                        <p className="text-sm font-bold text-gray-700 m-0 mb-1">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 m-0">
                                            MP3, MP4, PDF up to 20MB
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="button"
                                        className="bg-[#E65038] hover:bg-[#d4412a] text-white px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        SAVE & CONTINUE{" "}
                                        <span aria-hidden="true">&rarr;</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Sidebar Area */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* Summary */}
                        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                            <h3 className="text-xs font-bold text-[#0B0B13] uppercase tracking-widest mb-4">
                                EVENT SUMMARY
                            </h3>
                            <div className="rounded-xl overflow-hidden mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600&auto=format&fit=crop"
                                    alt="Surreal Strings"
                                    className="w-full h-32 object-cover"
                                />
                            </div>
                            <h4 className="text-base font-black text-[#0B0B13] mb-2 leading-tight">
                                Surreal Strings – Solo Singing
                            </h4>
                            <span className="inline-block bg-purple-600 text-white text-[0.65rem] font-bold px-2 py-1 uppercase tracking-wider rounded mb-4">
                                MUSIC
                            </span>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        ></path>
                                    </svg>
                                    Solo
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    3 - 5 mins
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        ></path>
                                    </svg>
                                    Open for all departments
                                </div>
                            </div>
                        </div>

                        {/* Important Dates */}
                        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                            <h3 className="text-xs font-bold text-[#0B0B13] uppercase tracking-widest mb-4">
                                IMPORTANT DATES
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 font-medium">
                                        Registration Starts
                                    </span>
                                    <span className="text-xs font-bold text-green-600">
                                        15 Aug, 2024
                                    </span>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 font-medium">
                                        Registration Ends
                                    </span>
                                    <span className="text-xs font-bold text-red-500">
                                        30 Sep, 2024
                                    </span>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 font-medium">
                                        Event Date
                                    </span>
                                    <span className="text-xs font-bold text-blue-500">
                                        12 Oct, 2024
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Rules at a Glance */}
                        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                            <h3 className="text-xs font-bold text-[#0B0B13] uppercase tracking-widest mb-4">
                                RULES AT A GLANCE
                            </h3>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2">
                                    <svg
                                        className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <span className="text-xs text-gray-600">
                                        Participants must carry valid ID card.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg
                                        className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <span className="text-xs text-gray-600">
                                        Use of pre-recorded tracks is allowed.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg
                                        className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <span className="text-xs text-gray-600">
                                        Time limit must be strictly followed.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg
                                        className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <span className="text-xs text-gray-600">
                                        Decision of the judges will be final.
                                    </span>
                                </li>
                            </ul>
                            <Link
                                to="#"
                                className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors inline-flex items-center gap-1"
                            >
                                View full rules & guidelines &rarr;
                            </Link>
                        </div>

                        {/* Need Help */}
                        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                            <h3 className="text-xs font-bold text-[#0B0B13] uppercase tracking-widest mb-4">
                                NEED HELP?
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Feel free to contact our event coordinators.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs text-[#0B0B13] font-medium">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        ></path>
                                    </svg>
                                    events@kala2024.in
                                </div>
                                <div className="flex items-center gap-3 text-xs text-[#0B0B13] font-medium">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        ></path>
                                    </svg>
                                    +91 98765 43210
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
