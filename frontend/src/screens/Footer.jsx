import { useLocation, Link } from "react-router-dom";

export default function Footer() {
    const location = useLocation();

    // Hide on auth pages
    const authPages = ["/login", "/register"];
    if (authPages.includes(location.pathname)) return null;

    return (
        <footer className="bg-[#0B0B13] border-t border-white/5 pt-16 pb-8 px-8 text-sm">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 mb-16">
                    {/* Column 1: Logo & Info */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <Link
                            to="/"
                            className="flex flex-col no-underline mb-2"
                        >
                            <div className="flex items-baseline gap-2">
                                <span className="text-white text-2xl font-black tracking-widest leading-none">
                                    KALĀ
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 text-2xl font-black leading-none">
                                    2024
                                </span>
                            </div>
                            <span className="text-white text-[0.55rem] font-bold tracking-[0.2em] mt-1">
                                THE COLLEGE ARTS FEST
                            </span>
                        </Link>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
                            Celebrating creativity, inspiring minds and lighting
                            up the stage of expression.
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            {/* Social Icons */}
                            {/* Insta */}
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-pink-500 hover:bg-pink-500/10 transition-all"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            {/* Facebook */}
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-pink-500 hover:bg-pink-500/10 transition-all"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                            </a>
                            {/* YouTube */}
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-pink-500 hover:bg-pink-500/10 transition-all"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 002.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            {/* Twitter */}
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-pink-500 hover:bg-pink-500/10 transition-all"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            {/* Email */}
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-pink-500 hover:bg-pink-500/10 transition-all"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold tracking-wider text-sm mb-2">
                            QUICK LINKS
                        </h4>
                        <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                            {[
                                "About",
                                "Events",
                                "Schedule",
                                "Results",
                                "Gallery",
                                "Sponsors",
                                "Team",
                                "Contact",
                            ].map((link) => (
                                <li key={link}>
                                    <Link
                                        to={`/${link.toLowerCase()}`}
                                        className="text-gray-400 hover:text-pink-400 text-xs transition-colors"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Important */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold tracking-wider text-sm mb-2">
                            IMPORTANT
                        </h4>
                        <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                            {[
                                "Rules & Guidelines",
                                "Privacy Policy",
                                "Terms & Conditions",
                                "FAQs",
                            ].map((link) => (
                                <li key={link}>
                                    <Link
                                        to="#"
                                        className="text-gray-400 hover:text-pink-400 text-xs transition-colors"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Get in Touch */}
                    <div className="flex flex-col gap-4 lg:col-span-1">
                        <h4 className="text-white font-bold tracking-wider text-sm mb-2">
                            GET IN TOUCH
                        </h4>
                        <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                            <li className="flex items-start gap-3 text-gray-400 text-xs">
                                <svg
                                    className="w-4 h-4 shrink-0 mt-0.5"
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
                                WMO IG Arts & Science college CH Village,
                                Kappumchal, Cherukattor P.O, Panamaram, Wayanad
                                Dist., Kerala, 670721
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-xs">
                                <svg
                                    className="w-4 h-4 shrink-0"
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
                                <a href="tel:+919188663304">+91 9188663304</a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-xs">
                                <svg
                                    className="w-4 h-4 shrink-0"
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
                                <a href="mailto:igasckoolivayal@gmail.com">
                                    igasckoolivayal@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-xs">
                                <svg
                                    className="w-4 h-4 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                    ></path>
                                </svg>
                                <a href="https://www.wmoigasc.co.in/">
                                    https://www.wmoigasc.co.in/
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 5: Quote */}
                    <div className="flex flex-col gap-4 lg:col-span-1">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="text-white text-base italic font-medium leading-relaxed">
                            Art is not what you see, but what you make others
                            see.
                        </p>
                        <div className="w-32 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-transparent mt-2"></div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} KALĀ – The College Arts
                        Fest. All Rights Reserved. Developed by{" "}
                        <a href="https://nihalt.in">Nihal T</a>
                    </p>
                    <button
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="text-gray-400 hover:text-white text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        Back to Top{" "}
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
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    );
}
