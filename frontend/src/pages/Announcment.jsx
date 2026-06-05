import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bg from "../assets/images/anncouncment_bg.png";
import api from "../api/axios";

export default function Announcment() {
    const [announcements, setAnnouncements] = useState([]);
    const [openId, setOpenId] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await api.get("/announcements/");
                setAnnouncements(response.data);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };

        fetchAnnouncements();

        const interval = setInterval(() => {
            fetchAnnouncements();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0B0B13] min-h-screen font-sans text-white pb-24">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center pt-32 pb-24 px-6 lg:px-12 overflow-hidden"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="absolute inset-0 bg-[#0B0B13]/80"></div>

                <div className="relative z-10 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
                        <Link
                            to="/"
                            className="hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <span>&gt;</span>
                        <span className="text-white">Announcements</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider mb-2 leading-none">
                        ANNOUNCEMENTS
                    </h1>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider mb-6 text-transparent bg-clip-text bg-white leading-none">
                        &amp; UPDATES
                    </h1>

                    <div className="text-3xl md:text-4xl font-medium italic mb-8 bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text w-fit">
                        Stay Informed. Stay Ahead.
                    </div>

                    <p className="text-gray-300 text-lg max-w-lg leading-relaxed">
                        Get the latest updates, important notices and real-time
                        announcements about Kalā 2024.
                    </p>
                </div>
            </section>

            {/* Announcements */}
            <section className="px-6 lg:px-12 max-w-[1200px] mx-auto -mt-8 relative z-20">
                <div className="space-y-5">
                    {announcements.map((ann) => (
                        <div
                            key={ann.id}
                            onClick={() =>
                                setOpenId(openId === ann.id ? null : ann.id)
                            }
                            className="bg-[#15151E] border border-white/5 rounded-2xl p-6 hover:bg-[#1A1A24] transition-all duration-300 cursor-pointer"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex w-11/12 items-center justify-between gap-1">
                                    <h2 className="text-lg md:text-xl font-bold text-white">
                                        {ann.title}
                                    </h2>
                                    <h2>
                                        {new Date(
                                            ann.created_at,
                                        ).toLocaleDateString()}{" "}
                                        {new Date(
                                            ann.created_at,
                                        ).toLocaleTimeString()}
                                    </h2>
                                </div>

                                <div className="text-2xl font-bold text-purple-400">
                                    {openId === ann.id ? "−" : "+"}
                                </div>
                            </div>

                            {/* Expand Content */}
                            <div
                                className={`overflow-hidden transition-all duration-500 ${
                                    openId === ann.id
                                        ? "h-auto mt-5 opacity-100"
                                        : "max-h-0 opacity-0"
                                }`}
                            >
                                <p className="text-gray-300 leading-relaxed mb-5">
                                    {ann.message}
                                </p>

                                {ann.link && (
                                    <a
                                        href={ann.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                                    >
                                        Open Link →
                                    </a>
                                )}

                                <div className="mt-5 text-sm text-gray-500">
                                    {new Date(ann.created_at).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
