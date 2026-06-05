import React, { useEffect, useState, useRef } from "react";
import running_bg from "../assets/images/running_bg.png";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
    label,
    icon,
    extraClass = "",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            className={`flex-1 flex items-center gap-3 bg-[#1e1332] p-3 rounded-lg hover:bg-[#25183d] transition relative ${extraClass}`}
            ref={dropdownRef}
        >
            {icon}
            <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">{label}</div>
                <div
                    className="w-full bg-transparent text-sm font-semibold text-white outline-none cursor-pointer flex justify-between items-center"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="truncate">{value || placeholder}</span>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
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

            {isOpen && (
                <div className="absolute z-50 top-[calc(100%+8px)] left-0 right-0 bg-[#1e1332] border border-purple-500/30 rounded-lg shadow-[0_10px_40px_rgba(219,39,119,0.15)] max-h-60 overflow-y-auto hide-scrollbar py-2">
                    <div
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-pink-600/20 hover:text-pink-400 transition ${!value ? "text-pink-400 bg-pink-600/10" : "text-gray-300"}`}
                        onClick={() => {
                            onChange("");
                            setIsOpen(false);
                        }}
                    >
                        {placeholder}
                    </div>
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-pink-600/20 hover:text-pink-400 transition ${value === opt ? "text-pink-400 bg-pink-600/10" : "text-gray-300"}`}
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Shedule() {
    const [schedule, setSchedule] = useState([]);
    const user = useSelector(selectUser);
    const [dates, setDates] = useState([]);
    const [stages, setStages] = useState([]);
    const [events, setEvents] = useState([]);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedStage, setSelectedStage] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [dateRes, stageRes, eventRes] = await Promise.all([
                    api.get("/schedule/schedule/date/"),
                    api.get("/schedule/schedule/stage/"),
                    api.get("/schedule/schedule/event/"),
                ]);

                setDates(dateRes.data);
                setStages(stageRes.data);
                setEvents(eventRes.data);
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };

        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const params = new URLSearchParams();
                if (selectedDate) params.append("date", selectedDate);
                if (selectedStage) params.append("stage", selectedStage);
                if (selectedEvent) params.append("event", selectedEvent);

                const response = await api.get(
                    `/schedule/schedule/?${params.toString()}`,
                );
                setSchedule(response.data);
            } catch (error) {
                console.error("Error fetching schedule:", error);
            }
        };
        fetchSchedule();
    }, [selectedDate, selectedStage, selectedEvent]);
    const navigate = useNavigate();
    return (
        <div className="bg-[#0b0616] min-h-[calc(100vh-800px)] text-white font-sans pt-6 pb-12 px-6 lg:px-24">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#150d24] p-4 rounded-xl border border-purple-900/50">
                <CustomSelect
                    label="Select Date"
                    placeholder="All Dates"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    options={dates}
                    icon={
                        <svg
                            className="w-6 h-6 text-purple-400 shrink-0"
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
                    }
                />
                <CustomSelect
                    label="Select Stage"
                    placeholder="All Stages"
                    value={selectedStage}
                    onChange={setSelectedStage}
                    options={stages}
                    extraClass="border-y md:border-y-0 md:border-x border-purple-900/30"
                    icon={
                        <svg
                            className="w-6 h-6 text-purple-400 shrink-0"
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
                    }
                />
                <CustomSelect
                    label="Select Event"
                    placeholder="All Events"
                    value={selectedEvent}
                    onChange={setSelectedEvent}
                    options={events}
                    icon={
                        <svg
                            className="w-6 h-6 text-pink-500 shrink-0"
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
                    }
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="w-full">
                    {/* Info Banner */}
                    <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <div className="mt-0.5 text-purple-400 border border-purple-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">
                            i
                        </div>
                        <p className="text-purple-200 text-sm">
                            Participants must report at the reporting time.
                            Order may be adjusted by stage coordinators if
                            required.
                        </p>
                    </div>

                    {/* Table */}
                    <div className="bg-[#150d24] rounded-xl border border-purple-900/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap lg:whitespace-normal">
                                <thead className="bg-[#1e1332] text-gray-300 font-semibold border-b border-purple-900/50 text-xs">
                                    <tr>
                                        <th className="px-4 py-4">ID</th>
                                        <th className="px-4 py-4">
                                            PROGRAM ID
                                        </th>
                                        <th className="px-4 py-4 min-w-[150px]">
                                            PROGRAM NAME
                                        </th>
                                        <th className="px-4 py-4 min-w-[150px]">
                                            VENUE
                                        </th>
                                        <th className="px-4 py-4 min-w-[200px]">
                                            MESSAGE
                                        </th>
                                        <th className="px-4 py-4">START AT</th>
                                        {user.role == "admin" && (
                                            <th className="px-4 py-4">Edit</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-purple-900/30">
                                    {schedule.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-purple-900/10 transition"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg bg-pink-600">
                                                    {item.id}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-gray-300">
                                                {item.program}
                                            </td>
                                            <td className="px-4 py-4 font-semibold text-gray-100 uppercase tracking-wider">
                                                {item.program_name}
                                            </td>
                                            <td className="px-4 py-4 text-gray-400 text-xs lg:text-sm">
                                                {item.venue}
                                            </td>
                                            <td className="px-4 py-4 text-gray-300">
                                                {item.message}
                                            </td>
                                            <td className="px-4 py-4 text-gray-300">
                                                {new Date(
                                                    item.start_at,
                                                ).toLocaleString()}
                                            </td>
                                            {user.role == "admin" && (
                                                <th
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/schedule/${item.id}`,
                                                        )
                                                    }
                                                    className="px-4 py-4"
                                                >
                                                    Edit
                                                </th>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {schedule.length === 0 && (
                                <div className="text-center text-gray-400 py-12">
                                    No schedule data available for the selected
                                    filters.
                                </div>
                            )}
                        </div>
                        <div className="bg-[#1e1332]/50 p-4 border-t border-purple-900/50 flex items-center gap-2 text-sm text-gray-400">
                            <svg
                                className="w-4 h-4 text-pink-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            Please be ready 15 minutes before your performance
                            time.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
