import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bg from "../assets/images/trophy_bg.png";
import api from "../api/axios";

export default function Point_Table() {
    const [activeTab, setActiveTab] = useState("overall");
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedYearId, setSelectedYearId] = useState("");
    const [leaderboardData, setLeaderboardData] = useState({
        teams: [],
        departments: [],
        academic_year: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
                const response = await api.get("/auth/academic-years/");
                setAcademicYears(response.data);
            } catch (err) {
                console.error("Error fetching academic years:", err);
            }
        };
        fetchAcademicYears();
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = selectedYearId 
                    ? `/results/leaderboard/?academic_year=${selectedYearId}`
                    : "/results/leaderboard/";
                const response = await api.get(url);
                setLeaderboardData(response.data);
                if (!selectedYearId && response.data.academic_year) {
                    setSelectedYearId(response.data.academic_year.id);
                }
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setError(err.response?.data?.error || "Failed to load leaderboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [selectedYearId]);

    const getRankStyles = (rank) => {
        if (rank === 1) {
            return {
                badgeColor: "bg-yellow-500 text-black",
                glow: "shadow-[0_0_15px_rgba(234,179,8,0.4)]",
                color: "text-yellow-500",
            };
        }
        if (rank === 2) {
            return {
                badgeColor: "bg-gray-300 text-black",
                glow: "shadow-[0_0_15px_rgba(209,213,219,0.4)]",
                color: "text-gray-300",
            };
        }
        if (rank === 3) {
            return {
                badgeColor: "bg-orange-400 text-black",
                glow: "shadow-[0_0_15px_rgba(251,146,60,0.4)]",
                color: "text-orange-400",
            };
        }
        return {
            badgeColor: "bg-gray-700 text-white",
            glow: "",
            color: "text-purple-400",
        };
    };

    const activeList = activeTab === "overall" ? leaderboardData.teams : leaderboardData.departments;
    const totalPoints = activeList.reduce((sum, item) => sum + item.total_points, 0);


    return (
        <div className="bg-[#0B0B13] min-h-screen font-sans text-white">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center pt-32 pb-24 px-6 lg:px-12 border-b border-white/5"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B13] via-[#0B0B13]/80 to-[#0B0B13]/30"></div>

                <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-wider mb-2 leading-none text-white drop-shadow-lg">
                            POINT TABLE
                        </h1>

                        <div className="text-3xl md:text-4xl font-medium italic mb-8 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text w-fit drop-shadow-md">
                            Every Performance. Every Point. One Champion.
                        </div>

                        <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                            A celebration of talent, dedication and teamwork.
                            Check out how your department is performing!
                        </p>
                    </div>

                    <div className="hidden lg:block relative h-[400px]">
                        {/* The trophy image is in the background image */}
                    </div>
                </div>

                {/* Bottom Navigation & Actions */}
                <div className="absolute bottom-0 left-6 right-6 lg:left-12 lg:right-12 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end md:items-center">
                    {/* Tabs */}
                    <div className="flex items-center bg-[#1A1A24] rounded-t-xl overflow-hidden border-t border-l border-r border-white/10">
                        <button
                            onClick={() => setActiveTab("overall")}
                            className={`flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${
                                activeTab === "overall"
                                    ? "bg-purple-600 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
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
                                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                ></path>
                            </svg>
                            OVERALL POINT TABLE
                        </button>
                        <button
                            onClick={() => setActiveTab("department")}
                            className={`flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${
                                activeTab === "department"
                                    ? "bg-purple-600 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
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
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                ></path>
                            </svg>
                            DEPARTMENT WISE BREAKDOWN
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mb-4 md:mb-0">
                        <button className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold uppercase transition-colors px-4 py-2">
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
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                ></path>
                            </svg>
                            Share
                        </button>
                        <button className="border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 flex items-center gap-2 text-sm font-bold uppercase transition-colors px-6 py-2 rounded-full">
                            Download
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
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="px-6 lg:px-12 py-12 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Left Main Table (span 3) */}
                    <div className="lg:col-span-3 bg-[#15151E] rounded-2xl border border-white/5 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0">
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
                                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold tracking-wider uppercase text-white m-0">
                                        {activeTab === "overall" ? "OVERALL TEAM STANDINGS" : "DEPARTMENT STANDINGS"}
                                    </h2>
                                    <p className="text-gray-400 text-sm m-0">
                                        Live points table for the selected academic year
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {academicYears.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-400 font-bold uppercase">Year:</label>
                                        <select
                                            value={selectedYearId}
                                            onChange={(e) => setSelectedYearId(e.target.value)}
                                            className="bg-[#1A1A24] text-xs text-gray-300 border border-white/10 rounded-full px-4 py-2 focus:outline-none focus:border-purple-500 cursor-pointer"
                                        >
                                            {academicYears.map((year) => (
                                                <option key={year.id} value={year.id}>
                                                    {year.year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="text-center py-20 text-gray-400 font-medium">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                                    Loading standings data...
                                </div>
                            ) : error ? (
                                <div className="text-center py-20 text-red-400 font-medium px-4">
                                    Error: {error}
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-[#1A1A24]">
                                            <th className="py-4 px-6 text-xs font-bold tracking-widest text-gray-400 uppercase w-20 text-center">
                                                RANK
                                            </th>
                                            <th className="py-4 px-6 text-xs font-bold tracking-widest text-gray-400 uppercase">
                                                {activeTab === "overall" ? "TEAM" : "DEPARTMENT"}
                                            </th>
                                            <th className="py-4 px-4 text-xs font-bold tracking-widest text-yellow-500 uppercase text-center border-l border-white/5">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-yellow-500 text-lg">🥇</span>
                                                    1ST PLACES
                                                </div>
                                            </th>
                                            <th className="py-4 px-4 text-xs font-bold tracking-widest text-gray-300 uppercase text-center border-l border-white/5">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-gray-300 text-lg">🥈</span>
                                                    2ND PLACES
                                                </div>
                                            </th>
                                            <th className="py-4 px-4 text-xs font-bold tracking-widest text-orange-400 uppercase text-center border-l border-white/5">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-orange-400 text-lg">🥉</span>
                                                    3RD PLACES
                                                </div>
                                            </th>
                                            <th className="py-4 px-6 text-sm font-black tracking-widest text-purple-500 uppercase text-center border-l border-white/5">
                                                TOTAL
                                                <br />
                                                POINTS
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {activeList.map((row) => {
                                            const styles = getRankStyles(row.rank);
                                            return (
                                                <tr
                                                    key={row.id}
                                                    className="hover:bg-white/5 transition-colors group"
                                                >
                                                    <td className="py-5 px-6 text-center">
                                                        <div
                                                            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-black text-lg ${styles.badgeColor} ${styles.glow}`}
                                                        >
                                                            {row.rank}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className={`w-12 h-12 rounded-lg border border-white/10 bg-[#1A1A24] flex items-center justify-center shrink-0 ${row.rank <= 3 ? "shadow-[0_0_10px_rgba(255,255,255,0.1)]" : ""}`}
                                                            >
                                                                <svg
                                                                    className={`w-6 h-6 ${styles.color}`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                            <span className="font-bold text-gray-200 text-sm md:text-base leading-snug">
                                                                {row.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-center border-l border-white/5 text-gray-300 font-medium">
                                                        {row.first_places}
                                                    </td>
                                                    <td className="py-5 px-4 text-center border-l border-white/5 text-gray-300 font-medium">
                                                        {row.second_places}
                                                    </td>
                                                    <td className="py-5 px-4 text-center border-l border-white/5 text-gray-300 font-medium">
                                                        {row.third_places}
                                                    </td>
                                                    <td className="py-5 px-6 text-center border-l border-white/5">
                                                        <span
                                                            className={`font-black text-xl ${styles.color}`}
                                                        >
                                                            {row.total_points}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {activeList.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-10 text-gray-400">
                                                    No rankings available for this year yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebars (span 1) */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Current Highlights */}
                        <div className="bg-[#15151E] border border-white/5 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                                <svg
                                    className="w-5 h-5 text-purple-500"
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
                                <h4 className="font-bold tracking-widest text-sm uppercase m-0 text-white">
                                    CURRENT STANDINGS
                                </h4>
                            </div>
                            <div className="p-6 space-y-4">
                                {activeList.slice(0, 3).map((item, idx) => {
                                    const trophyColors = ["text-yellow-500 bg-yellow-500/10 border-yellow-500/20", "text-gray-300 bg-gray-300/10 border-gray-300/20", "text-orange-400 bg-orange-400/10 border-orange-400/20"];
                                    const placesText = `${item.first_places}🥇 | ${item.second_places}🥈 | ${item.third_places}🥉`;
                                    return (
                                        <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#1A1A24] border border-white/5">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${trophyColors[idx] || "text-purple-400 bg-purple-500/10 border-purple-500/20"}`}>
                                                <span className="font-bold text-sm">#{idx + 1}</span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <h5 className="font-bold text-white text-sm mb-1 truncate">
                                                    {item.name}
                                                </h5>
                                                <p className="text-gray-400 text-xs">
                                                    Points: <strong className="text-white">{item.total_points}</strong> ({placesText})
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {activeList.length === 0 && (
                                    <p className="text-gray-400 text-xs text-center py-4">No standings active.</p>
                                )}
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-[#15151E] border border-white/5 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h4 className="font-bold tracking-widest text-sm uppercase m-0 text-white">
                                    POINT DISTRIBUTION
                                </h4>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-center mb-6">
                                    <div
                                        className="relative w-32 h-32 rounded-full flex items-center justify-center"
                                        style={{
                                            background: (() => {
                                                const top5 = activeList.slice(0, 5);
                                                let cumulative = 0;
                                                const colors = ["#A855F7", "#EC4899", "#F97316", "#3B82F6", "#22C55E"];
                                                const gradientParts = [];
                                                top5.forEach((entry, idx) => {
                                                    const percentage = totalPoints > 0 ? (entry.total_points / totalPoints) * 100 : 0;
                                                    const start = cumulative;
                                                    cumulative += percentage;
                                                    gradientParts.push(`${colors[idx]} ${start}% ${cumulative}%`);
                                                });
                                                if (cumulative < 100) {
                                                    gradientParts.push(`#1F2937 ${cumulative}% 100%`);
                                                }
                                                return gradientParts.length > 0 ? `conic-gradient(${gradientParts.join(", ")})` : "#1F2937";
                                            })(),
                                        }}
                                    >
                                        <div className="w-24 h-24 bg-[#15151E] rounded-full flex flex-col items-center justify-center text-center">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">
                                                Total
                                                <br />
                                                Points
                                            </span>
                                            <span className="text-lg font-black text-white leading-none mt-1">
                                                {totalPoints}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {activeList.slice(0, 5).map((entry, idx) => {
                                        const percentage = totalPoints > 0 ? Math.round((entry.total_points / totalPoints) * 100) : 0;
                                        const colors = ["bg-purple-500", "bg-pink-500", "bg-orange-500", "bg-blue-500", "bg-green-500"];
                                        return (
                                            <div key={entry.id} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors[idx]}`}></div>
                                                    <span className="text-gray-300 truncate max-w-[140px]">
                                                        {entry.name}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-white shrink-0">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* How points are awarded */}
                        <div className="bg-[#15151E] border border-white/5 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h4 className="font-bold tracking-widest text-sm uppercase m-0 text-white">
                                    HOW POINTS ARE AWARDED?
                                </h4>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-3">
                                    <li className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 text-yellow-500">
                                                🥇
                                            </div>
                                            <span className="text-gray-300">
                                                1st Position
                                            </span>
                                        </div>
                                        <span className="text-gray-400">-</span>
                                        <span className="text-white font-bold w-16 text-right">
                                            5 Points
                                        </span>
                                    </li>
                                    <li className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 text-gray-300">
                                                🥈
                                            </div>
                                            <span className="text-gray-300">
                                                2nd Position
                                            </span>
                                        </div>
                                        <span className="text-gray-400">-</span>
                                        <span className="text-white font-bold w-16 text-right">
                                            3 Points
                                        </span>
                                    </li>
                                    <li className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 text-orange-400">
                                                🥉
                                            </div>
                                            <span className="text-gray-300">
                                                3rd Position
                                            </span>
                                        </div>
                                        <span className="text-gray-400">-</span>
                                        <span className="text-white font-bold w-16 text-right">
                                            1 Point
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Footer Banner */}
            <div className="border-t border-white/10 mt-12 overflow-hidden relative">
                {/* Dark gradient with crowd silhouette overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A0B1E] via-[#2D0A22] to-[#1F0A15]"></div>
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 px-6 lg:px-12 py-16 max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-center md:justify-start gap-8">
                    <div className="w-24 h-24 shrink-0 rounded-full border-2 border-purple-500 flex items-center justify-center text-purple-500 relative">
                        <div className="absolute -inset-2 rounded-full border border-purple-500/30"></div>
                        <svg
                            className="w-12 h-12"
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
                    </div>

                    <div className="text-center md:text-left">
                        <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed mb-2">
                            Every point is a step towards glory.
                        </p>
                        <div className="text-4xl md:text-5xl font-medium italic bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text w-fit mx-auto md:mx-0">
                            Let the Best Department Win!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
