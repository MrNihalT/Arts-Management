import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/images/event_bg.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FetchActiveEvents,
    selectActiveEvents,
    selectEventLoading,
} from "../features/event/eventSlice";

export default function Event() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector(selectEventLoading);
    const [search, setSearch] = useState("");
    const [eventType, setEventType] = useState("");
    const [ordering, setOrdering] = useState("");

    const eventTypes = ["Solo", "Group"];

    useEffect(() => {
        const query = new URLSearchParams();

        if (search) {
            query.append("search", search);
        }

        if (eventType) {
            query.append("type", eventType);
        }

        if (ordering) {
            query.append("ordering", ordering);
        }

        dispatch(FetchActiveEvents(query.toString()));
    }, [dispatch, search, eventType, ordering]);

    const events = useSelector(selectActiveEvents) || [];
    console.log(events);

    // Define a fallback image
    const fallbackImage =
        "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600&auto=format&fit=crop";

    return (
        <div className="bg-[#f8f9fa] min-h-screen font-sans">
            {/* Hero Section */}
            <section
                className="relative bg-[#0b132b] bg-cover bg-center pt-32 pb-20 px-6 lg:px-12 flex flex-col justify-center min-h-[500px]"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 max-w-[1400px] w-full mx-auto">
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-wider text-white mb-6 transform -rotate-2">
                        EVENTS
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mb-6"></div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-widest text-white mb-4 uppercase">
                        Explore. Participate. Shine.
                    </h2>
                    <p className="text-gray-300 text-lg max-w-xl">
                        A platform for every artist to express, compete and
                        create unforgettable memories.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-6 lg:px-12 py-12 max-w-[1400px] mx-auto">
                {/* Top Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-black text-[#0B0B13] uppercase tracking-wider m-0">
                            ALL EVENTS
                        </h3>
                        <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <svg
                                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white border border-gray-200 text-gray-800 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:border-indigo-500 shadow-sm"
                            />
                        </div>

                        <button
                            onClick={() => navigate("/my-events")}
                            className="bg-[#0B0B13] hover:bg-gray-800 text-white px-8 py-3 rounded-full font-bold text-sm tracking-wider transition-colors shrink-0"
                        >
                            Registered Events
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1A202C] text-white rounded-2xl p-6 shadow-xl  top-24">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
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
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                    ></path>
                                </svg>
                                <h4 className="font-bold tracking-widest text-sm uppercase m-0">
                                    FILTERS
                                </h4>
                            </div>

                            <div className="mb-8">
                                <h5 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">
                                    EVENT TYPE
                                </h5>
                                <div className="flex flex-col gap-3">
                                    {eventTypes.map((type, idx) => (
                                        <label
                                            key={idx}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="radio"
                                                name="eventType"
                                                checked={
                                                    eventType ===
                                                    type.toLowerCase()
                                                }
                                                onChange={() =>
                                                    setEventType(
                                                        type.toLowerCase(),
                                                    )
                                                }
                                                className="accent-orange-500"
                                            />

                                            <span className="text-sm text-gray-300">
                                                {type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h5 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">
                                    SORT BY
                                </h5>
                                <select
                                    value={ordering}
                                    onChange={(e) =>
                                        setOrdering(e.target.value)
                                    }
                                    className="w-full bg-[#2D3748] border border-gray-600 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 appearance-none"
                                >
                                    <option value="">Select</option>
                                    <option value="a-z">A - Z</option>
                                    <option value="z-a">Z - A</option>
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>

                            <button
                                onClick={() => {
                                    setSearch("");
                                    setEventType("");
                                    setOrdering("");
                                }}
                                className="w-full py-3 rounded-full border border-orange-500/50 text-orange-400 font-bold text-xs tracking-wider uppercase hover:bg-orange-500/10 transition-colors"
                            >
                                RESET FILTERS
                            </button>
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.length === 0 && !isLoading && (
                                <div className="col-span-full py-12 text-center text-gray-500">
                                    No events found.
                                </div>
                            )}
                            {isLoading && (
                                <div className="col-span-full py-12 text-center text-gray-500">
                                    Loading events...
                                </div>
                            )}
                            {events.map((event) => (
                                <div
                                    onClick={() =>
                                        navigate(`/event/${event.id}`)
                                    }
                                    key={event.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={
                                                event.event_image ||
                                                fallbackImage
                                            }
                                            alt={event.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div
                                            className={`absolute bottom-0 left-0 bg-general text-white text-[0.65rem] font-bold px-3 py-1.5 uppercase tracking-wider rounded-tr-lg`}
                                        >
                                            {event.category || "EVENT"}
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h4 className="text-[#0B0B13] font-black text-lg m-0 mb-1 leading-tight">
                                            {event.name}
                                        </h4>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                            {event.description ||
                                                (event.is_team_based
                                                    ? "Group Event"
                                                    : "Solo Event")}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-6">
                                            <div className="flex items-center gap-1.5">
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
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    ></path>
                                                </svg>
                                                {event.is_team_based
                                                    ? "Group"
                                                    : "Solo"}
                                            </div>
                                            <div className="flex items-center gap-1.5">
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
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    ></path>
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    ></path>
                                                </svg>
                                                {event.venue || "TBA"}
                                            </div>
                                        </div>

                                        <Link
                                            to={`/events/${event.id}`}
                                            className="mt-auto text-orange-500 hover:text-orange-600 text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-colors w-fit"
                                        >
                                            VIEW DETAILS{" "}
                                            <span aria-hidden="true">
                                                &rarr;
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button className="w-10 h-10 rounded-full bg-[#0B0B13] text-white flex items-center justify-center font-bold text-sm shadow-md">
                                1
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm transition-colors">
                                2
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm transition-colors">
                                3
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm transition-colors">
                                4
                            </button>
                            <span className="text-gray-400 px-2">...</span>
                            <button className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm transition-colors">
                                8
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors">
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
                                        d="M9 5l7 7-7 7"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Banners */}
            <section className="px-6 lg:px-12 pb-24 max-w-[1400px] mx-auto">
                <div className="bg-[#0B132B] rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 relative z-10">
                        <div className="p-10 lg:p-16 flex flex-col justify-center items-start lg:items-center text-left lg:text-center">
                            <h3 className="text-white text-2xl font-black uppercase tracking-widest mb-2">
                                CAN'T FIND YOUR EVENT?
                            </h3>
                            <p className="text-gray-400 text-sm mb-8">
                                Suggest an event and be a part of Kala 2026!
                            </p>
                            <button className="bg-transparent border border-white text-white hover:bg-white hover:text-[#0B132B] px-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-2">
                                SUGGEST AN EVENT{" "}
                                <span aria-hidden="true">&rarr;</span>
                            </button>
                        </div>
                        <div className="p-10 lg:p-16 flex flex-col justify-center items-start lg:items-center text-left lg:text-center relative">
                            <h3 className="text-white text-2xl font-black uppercase tracking-widest mb-2">
                                READY TO PARTICIPATE?
                            </h3>
                            <p className="text-gray-400 text-sm mb-8">
                                Register now and showcase your talent.
                            </p>
                            <Link
                                to="/register-event"
                                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] px-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2"
                            >
                                REGISTER NOW{" "}
                                <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
