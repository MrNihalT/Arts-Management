import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bg from "../assets/images/gallery_bg.png";
import api from "../api/axios";

export default function Gallery() {
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [gallery, setGallery] = useState([]);
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                api.get("/gallery/").then((response) => {
                    const allImages = response.data.flatMap((item) =>
                        item.images.map((img) => ({
                            url: img.image,
                            categories: item.category || [],
                        })),
                    );
                    setGallery(allImages);
                });
            } catch (error) {
                console.log(JSON.stringify(error), "error nd mone");
            }
        };
        fetchGallery();
    }, []);

    const dynamicCategories = [
        ...new Set(
            gallery.flatMap((img) =>
                img.categories.map((c) => c.toUpperCase()),
            ),
        ),
    ];
    const filters = ["ALL", ...dynamicCategories];

    const filteredGallery = gallery.filter((imgObj) => {
        if (activeFilter === "ALL") return true;

        return imgObj.categories.some(
            (cat) => cat.toUpperCase() === activeFilter,
        );
    });

    return (
        <div className="bg-[#0B0B13] min-h-screen font-sans text-white pb-20">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center pt-32 pb-24 px-6 lg:px-12"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="absolute inset-0 bg-[#0B0B13]/70 lg:bg-gradient-to-r lg:from-[#0B0B13] lg:via-[#0B0B13]/80 lg:to-transparent"></div>

                <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[400px]">
                    <div>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-wider mb-2 leading-none text-white drop-shadow-lg">
                            GALLERY
                        </h1>

                        <div className="text-3xl md:text-4xl lg:text-5xl font-medium italic mb-6 bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text w-fit drop-shadow-md">
                            Moments of Creativity.
                            <br />
                            Memories for a Lifetime.
                        </div>

                        <p className="text-gray-300 text-lg max-w-md leading-relaxed mb-8">
                            A glimpse of the energy, passion and creativity that
                            made Kalā 2024 an unforgettable celebration of art.
                        </p>
                    </div>

                    <div className="hidden lg:block relative">
                        {/* The right side of the background image contains the beautiful photo collage */}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="px-6 lg:px-12 max-w-[1400px] mx-auto relative z-20 -mt-10">
                {/* Filter Bar */}
                <div className="bg-[#15151E] rounded-2xl border border-white/5 p-4 flex items-center gap-3 flex-wrap shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-10 overflow-x-auto no-scrollbar">
                    {filters.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-200 ${
                                activeFilter === cat
                                    ? "bg-purple-600/25 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                                    : "text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {filteredGallery.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 italic">
                        No images found for this category.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
                        {filteredGallery.map((imgObj, index) => (
                            <div
                                key={index}
                                className="aspect-[4/3] rounded-2xl overflow-hidden relative group cursor-pointer border border-white/10 bg-[#1A1A24] shadow-lg hover:shadow-purple-500/20 transition-all duration-500"
                            >
                                <img
                                    src={imgObj.url}
                                    alt={`Gallery image ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B13]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Optional: Hover icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100">
                                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">
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
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                <div className="flex justify-center mb-20">
                    <button className="border border-white/20 text-white hover:bg-white/5 px-8 py-3 rounded-full font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-3">
                        LOAD MORE
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            ></path>
                        </svg>
                    </button>
                </div>
            </section>
        </div>
    );
}
