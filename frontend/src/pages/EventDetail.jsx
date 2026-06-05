import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FetchEventDetail,
    RegisterForEvent,
    selectEventDetail,
    selectEventLoading,
    selectEventError,
    selectEventRegistrationSuccess,
    resetEventState,
} from "../features/event/eventSlice";
import { searchStudentsAPI } from "../features/event/eventApi";
import { useDispatch, useSelector } from "react-redux";

export default function EventDetail() {
    const user = useSelector((state) => state.auth.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const event = useSelector(selectEventDetail);
    const isLoading = useSelector(selectEventLoading);
    const error = useSelector(selectEventError);
    const registrationSuccess = useSelector(selectEventRegistrationSuccess);

    // Team member state
    const [teamMembers, setTeamMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchTimer = useRef(null);

    const handleSearchStudents = (query) => {
        setSearchQuery(query);
        clearTimeout(searchTimer.current);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        searchTimer.current = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const results = await searchStudentsAPI(query);
                const list = Array.isArray(results)
                    ? results
                    : results.results || [];
                // exclude already added members and current user
                setSearchResults(
                    list.filter(
                        (s) =>
                            s.id !== user?.id &&
                            !teamMembers.find((m) => m.id === s.id),
                    ),
                );
            } catch {
                setSearchResults([]);
            }
            setSearchLoading(false);
        }, 400);
    };

    const addTeamMember = (student) => {
        if (teamMembers.length >= event?.max_team_members - 1) {
            alert(
                `Maximum ${event.max_team_members} members allowed (including you).`,
            );
            return;
        }
        setTeamMembers((prev) => [...prev, student]);
        setSearchQuery("");
        setSearchResults([]);
    };

    const removeTeamMember = (id) =>
        setTeamMembers((prev) => prev.filter((m) => m.id !== id));

    useEffect(() => {
        if (id) {
            dispatch(FetchEventDetail(id));
        }
        return () => {
            dispatch(resetEventState());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (registrationSuccess) {
            alert("Successfully registered for the event!");
            setTeamMembers([]);
            dispatch(resetEventState());
            dispatch(FetchEventDetail(id));
        } else if (error) {
            alert(
                error.detail ||
                    (typeof error === "string"
                        ? error
                        : "Registration failed."),
            );
            dispatch(resetEventState());
        }
    }, [registrationSuccess, error, dispatch, id]);

    // Format date string
    const formatDate = (dateString) => {
        if (!dateString) return "TBA";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center">
                <h2 className="text-3xl font-black text-[#0b132b] mb-4">
                    Event Not Found
                </h2>
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold uppercase tracking-wider hover:shadow-lg transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] w-full bg-[#0b132b] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
                    style={{ backgroundImage: `url(${event.event_image})` }}
                ></div>
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b] via-[#0b132b]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b132b]/90 via-[#0b132b]/50 to-transparent"></div>

                {/* Back Button */}
                <div className="absolute top-24 left-6 lg:left-12 z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-all bg-white/5 hover:bg-white/20 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase shadow-lg hover:-translate-x-1"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            ></path>
                        </svg>
                        BACK TO EVENTS
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 z-10 max-w-[1400px] mx-auto">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-black tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                            {event.arts_fest_detail?.name || "Arts Fest"}
                        </span>
                        <span
                            className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full backdrop-blur-md border ${event.is_active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}
                        >
                            {event.is_active ? "Registrations Open" : "Closed"}
                        </span>
                        {event.is_team_based ? (
                            <span className="px-4 py-1.5 bg-white/10 text-white border border-white/20 text-xs font-bold tracking-widest uppercase rounded-full backdrop-blur-md flex items-center gap-1.5">
                                <svg
                                    className="w-3.5 h-3.5"
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
                                Group Event
                            </span>
                        ) : (
                            <span className="px-4 py-1.5 bg-white/10 text-white border border-white/20 text-xs font-bold tracking-widest uppercase rounded-full backdrop-blur-md flex items-center gap-1.5">
                                <svg
                                    className="w-3.5 h-3.5"
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
                                Solo Event
                            </span>
                        )}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-6 drop-shadow-lg leading-none">
                        {event.name}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 text-gray-300">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
                                <svg
                                    className="w-6 h-6 text-orange-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    ></path>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-[0.65rem] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                                    Venue
                                </p>
                                <p className="font-semibold text-white text-lg tracking-wide">
                                    {event.venue || "TBA"}
                                </p>
                            </div>
                        </div>
                        <div className="hidden sm:block w-px h-12 bg-white/20"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
                                <svg
                                    className="w-6 h-6 text-pink-400"
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
                            </div>
                            <div>
                                <p className="text-[0.65rem] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                                    Last Date to Register
                                </p>
                                <p className="font-semibold text-white text-lg tracking-wide">
                                    {formatDate(event.last_date)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="px-6 lg:px-12 py-12 max-w-[1400px] mx-auto -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Description Card */}
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center transform -rotate-3">
                                    <svg
                                        className="w-7 h-7 text-orange-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-black text-[#0B0B13] uppercase tracking-wider m-0">
                                    About Event
                                </h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg font-medium">
                                {event.description}
                            </p>
                        </div>

                        {/* Rules Card */}
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center transform rotate-3">
                                    <svg
                                        className="w-7 h-7 text-pink-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-black text-[#0B0B13] uppercase tracking-wider m-0">
                                    Rules & Guidelines
                                </h3>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-100">
                                <ul className="space-y-6">
                                    {(event.rules || "")
                                        .split("\n")
                                        .map((rule, idx) => (
                                            <li
                                                key={idx}
                                                className="flex gap-5 text-gray-700 group"
                                            >
                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-900 flex items-center justify-center text-sm font-black group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-500 group-hover:text-white group-hover:border-transparent transition-all">
                                                    {idx + 1}
                                                </span>
                                                <span className="leading-relaxed text-[1.05rem] font-medium pt-1">
                                                    {rule.replace(
                                                        /^\d+\.\s*/,
                                                        "",
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info & Actions */}
                    <div className="lg:col-span-1 flex flex-col gap-8 sticky top-32">
                        {/* Action Card */}
                        <div className="relative">
                            {/* Decorative blob outside so overflow-hidden doesn't clip dropdown */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10 pointer-events-none z-0"></div>
                            <div className="bg-[#0b132b] rounded-3xl p-8 shadow-[0_20px_40px_rgba(11,19,43,0.2)] text-white relative group z-10">
                                <h4 className="text-2xl font-black uppercase tracking-wider mb-2 relative z-10">
                                    Ready to Shine?
                                </h4>
                                <p className="text-gray-400 text-sm mb-6 relative z-10 font-medium leading-relaxed">
                                    Register now before the deadline closes.
                                </p>

                                {/* Team Member Picker - only for group events */}
                                {event.is_team_based && (
                                    <div className="relative z-10 mb-6">
                                        <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-3">
                                            Team Members ({teamMembers.length}/
                                            {event.max_team_members - 1} added)
                                        </p>

                                        {/* Added members list */}
                                        {teamMembers.length > 0 && (
                                            <div className="flex h-20 flex-col gap-2 mb-3 overflow-auto">
                                                {teamMembers.map((m) => (
                                                    <div
                                                        key={m.id}
                                                        className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2.5 border border-white/10"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-bold text-white">
                                                                {m.first_name}{" "}
                                                                {m.last_name}
                                                            </p>
                                                            <p className="text-[0.65rem] text-gray-400">
                                                                {m.username}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                removeTeamMember(
                                                                    m.id,
                                                                )
                                                            }
                                                            className="text-red-400 hover:text-red-300 transition-colors ml-2"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Search input */}
                                        {teamMembers.length <
                                            event.max_team_members - 1 && (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search student by username..."
                                                    value={searchQuery}
                                                    onChange={(e) => {
                                                        setSearchQuery(
                                                            e.target.value,
                                                        );
                                                        handleSearchStudents(
                                                            e.target.value,
                                                        );
                                                    }}
                                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors"
                                                />
                                                {searchLoading && (
                                                    <div className="absolute right-3 top-3">
                                                        <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                )}
                                                {searchResults.length > 0 && (
                                                    <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#1a2540] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[100]">
                                                        {searchResults
                                                            .slice(0, 5)
                                                            .map((s) => (
                                                                <button
                                                                    key={s.id}
                                                                    onClick={() =>
                                                                        addTeamMember(
                                                                            s,
                                                                        )
                                                                    }
                                                                    className="w-full text-left px-5 py-4 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                                                                >
                                                                    <p className="text-base font-bold text-white leading-tight">
                                                                        {
                                                                            s.first_name
                                                                        }{" "}
                                                                        {
                                                                            s.last_name
                                                                        }
                                                                    </p>
                                                                    <p className="text-[0.65rem] text-gray-400">
                                                                        {
                                                                            s.username
                                                                        }{" "}
                                                                        &bull;{" "}
                                                                        {s
                                                                            .department
                                                                            ?.name ||
                                                                            "No dept"}
                                                                    </p>
                                                                </button>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    className="w-full relative z-10 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-black py-4 px-6 rounded-xl uppercase tracking-widest text-sm transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => {
                                        if (!user) {
                                            navigate("/login");
                                            return;
                                        }
                                        if (user.is_alumni || user.is_dropout) {
                                            alert(
                                                "You are not eligible to register.",
                                            );
                                            return;
                                        }
                                        dispatch(
                                            RegisterForEvent({
                                                id: event.id,
                                                registrationData: {
                                                    team_member_ids:
                                                        teamMembers.map(
                                                            (m) => m.id,
                                                        ),
                                                },
                                            }),
                                        );
                                    }}
                                    disabled={!event.is_active || isLoading}
                                >
                                    {isLoading
                                        ? "Registering..."
                                        : "Register Now"}
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
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {/* end outer relative wrapper */}

                        <h3 className="text-xl font-black text-[#0B0B13] uppercase tracking-wider mb-8 pb-5 border-b border-gray-100 flex items-center justify-between">
                            Event Details
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
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </h3>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                        <svg
                                            className="w-4 h-4 text-indigo-500"
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
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        Event Type
                                    </span>
                                </div>
                                <span className="font-black text-[#0B0B13] tracking-wide">
                                    {event.is_team_based ? "Group" : "Solo"}
                                </span>
                            </div>

                            {event.is_team_based && (
                                <div className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                            <svg
                                                className="w-4 h-4 text-indigo-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            Max Team Size
                                        </span>
                                    </div>
                                    <span className="font-black text-[#0B0B13] tracking-wide">
                                        {event.max_team_members} Members
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                        <svg
                                            className="w-4 h-4 text-indigo-500"
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
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        Capacity
                                    </span>
                                </div>
                                <span className="font-black text-[#0B0B13] tracking-wide">
                                    {event.max_participants} Participants
                                </span>
                            </div>

                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                        <svg
                                            className="w-4 h-4 text-indigo-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        Restrictions
                                    </span>
                                </div>
                                <span className="font-black text-[#0B0B13] tracking-wide">
                                    {event.is_graduate_restricted
                                        ? "Graduates Only"
                                        : "None"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
