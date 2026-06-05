import React from "react";
import bg from "../assets/images/contact_us_bg.png";

const CONTACT_CATEGORIES = [
    {
        title: "CORE COMMITTEE",
        contacts: [
            {
                name: "Dr. Arun Kumar",
                role: "Festival Convener",
                phone: "+91 98765 43210",
                email: "convener.kala@college.edu",
            },
            {
                name: "Prof. Sarah James",
                role: "Joint Secretary",
                phone: "+91 98765 43211",
                email: "sarah.j@college.edu",
            },
            {
                name: "Mr. Rahul Varma",
                role: "Arts Secretary",
                phone: "+91 98765 43212",
                email: "rahul.v@student.college.edu",
            },
        ],
        theme: "purple",
    },
    {
        title: "DEPARTMENT COORDINATORS (TEACHERS)",
        subCategories: [
            {
                name: "Computer Science",
                contacts: [
                    {
                        name: "Prof. Anita Nair",
                        phone: "+91 91234 56780",
                        email: "anita.cs@college.edu",
                    },
                    {
                        name: "Mr. Sibin Das",
                        phone: "+91 91234 56781",
                        email: "sibin.cs@college.edu",
                    },
                ],
            },
            {
                name: "Mechanical Engineering",
                contacts: [
                    {
                        name: "Dr. Manoj P.",
                        phone: "+91 91234 56782",
                        email: "manoj.me@college.edu",
                    },
                    {
                        name: "Ms. Deepa K.",
                        phone: "+91 91234 56783",
                        email: "deepa.me@college.edu",
                    },
                ],
            },
            {
                name: "Electronics & Comm.",
                contacts: [
                    {
                        name: "Prof. George Kutty",
                        phone: "+91 91234 56784",
                        email: "george.ec@college.edu",
                    },
                    {
                        name: "Mrs. Lakshmi R.",
                        phone: "+91 91234 56785",
                        email: "lakshmi.ec@college.edu",
                    },
                ],
            },
        ],
        theme: "orange",
    },
    {
        title: "PROGRAMS & JUDGING COMMITTEE",
        contacts: [
            {
                name: "Dr. Sreekumar",
                role: "Chief Judge Coordinator",
                phone: "+91 91234 56786",
                email: "judges.kala@college.edu",
            },
            {
                name: "Prof. Meera Bai",
                role: "Stage Management",
                phone: "+91 91234 56787",
                email: "meera.b@college.edu",
            },
            {
                name: "Technical Support",
                role: "Digital & Results",
                phone: "+91 91234 56788",
                email: "support.kala@college.edu",
            },
        ],
        theme: "pink",
    },
];

export default function Contact() {
    return (
        <div className="bg-[#0B0B13] min-h-screen font-sans text-white pb-24">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center pt-32 pb-20 px-6 lg:px-12"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="absolute inset-0 bg-[#0B0B13]/70 lg:bg-gradient-to-r lg:from-[#0B0B13] lg:via-[#0B0B13]/80 lg:to-transparent"></div>

                <div className="relative z-10 max-w-[1200px] mx-auto min-h-[300px] flex flex-col justify-center">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-wider mb-2">
                        CONTACT DIRECTORY
                    </h1>
                    <div className="text-3xl md:text-4xl font-medium italic mb-6 bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text w-fit">
                        Connect with the KALĀ Team
                    </div>
                    <p className="text-gray-300 text-base max-w-2xl leading-relaxed mb-8">
                        For any queries regarding event rules, schedules, or
                        department-specific coordination, please reach out to
                        the respective officials listed below.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-6 lg:px-12 max-w-[1200px] mx-auto space-y-12 relative z-20 -mt-10">
                {CONTACT_CATEGORIES.map((category, idx) => (
                    <div key={idx} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h2
                                className={`text-2xl font-black tracking-widest uppercase border-l-4 pl-4 ${
                                    category.theme === "purple"
                                        ? "border-purple-500 text-purple-400"
                                        : category.theme === "orange"
                                          ? "border-orange-500 text-orange-400"
                                          : "border-pink-500 text-pink-400"
                                }`}
                            >
                                {category.title}
                            </h2>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>

                        {category.subCategories ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.subCategories.map((sub, sIdx) => (
                                    <div
                                        key={sIdx}
                                        className="bg-[#15151E] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors shadow-xl"
                                    >
                                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    category.theme === "purple"
                                                        ? "bg-purple-500"
                                                        : category.theme ===
                                                            "orange"
                                                          ? "bg-orange-500"
                                                          : "bg-pink-500"
                                                }`}
                                            ></span>
                                            {sub.name}
                                        </h3>
                                        <div className="space-y-4">
                                            {sub.contacts.map(
                                                (contact, cIdx) => (
                                                    <div
                                                        key={cIdx}
                                                        className="border-t border-white/5 pt-4 first:border-t-0 first:pt-0"
                                                    >
                                                        <p className="text-white font-bold text-base mb-2">
                                                            {contact.name}
                                                        </p>
                                                        <div className="space-y-1">
                                                            <a
                                                                href={`tel:${contact.phone}`}
                                                                className="flex items-center gap-2 text-gray-400 hover:text-white text-xs transition-colors"
                                                            >
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
                                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                                    />
                                                                </svg>
                                                                {contact.phone}
                                                            </a>
                                                            <a
                                                                href={`mailto:${contact.email}`}
                                                                className="flex items-center gap-2 text-gray-400 hover:text-white text-xs transition-colors"
                                                            >
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
                                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                                {contact.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.contacts.map((contact, cIdx) => (
                                    <div
                                        key={cIdx}
                                        className="bg-[#15151E] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors shadow-xl group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-white font-bold text-lg mb-1">
                                                    {contact.name}
                                                </h3>
                                                <p
                                                    className={`text-xs font-bold uppercase tracking-widest ${
                                                        category.theme ===
                                                        "purple"
                                                            ? "text-purple-400"
                                                            : category.theme ===
                                                                "orange"
                                                              ? "text-orange-400"
                                                              : "text-pink-400"
                                                    }`}
                                                >
                                                    {contact.role}
                                                </p>
                                            </div>
                                            <div
                                                className={`p-2 rounded-lg ${
                                                    category.theme === "purple"
                                                        ? "bg-purple-500/10 text-purple-400"
                                                        : category.theme ===
                                                            "orange"
                                                          ? "bg-orange-500/10 text-orange-400"
                                                          : "bg-pink-500/10 text-pink-400"
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
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors p-2 rounded-lg hover:bg-white/5"
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
                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                    />
                                                </svg>
                                                {contact.phone}
                                            </a>
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors p-2 rounded-lg hover:bg-white/5"
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
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                {contact.email}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Quick Assistance Banner */}
                <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>

                    <div className="relative z-10">
                        <h3 className="text-white text-2xl font-black mb-2 uppercase tracking-widest">
                            Need Immediate Help?
                        </h3>
                        <p className="text-gray-300 max-w-md">
                            Our student volunteer team is available at the
                            registration desk for on-the-spot assistance during
                            festival hours.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                        <div className="bg-white/10 border border-white/20 px-6 py-4 rounded-2xl flex items-center gap-4 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">
                                    Help Desk
                                </p>
                                <p className="text-gray-400 text-xs">
                                    +91 99999 88888
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
