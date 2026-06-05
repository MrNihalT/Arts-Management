import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import {
    getActiveProgramsAPI,
    getProgramsByYearAPI,
    getAllAcademicYearsAPI,
    registerForProgramAPI,
} from "../features/auth/authAPI";

/* ─── Small Badge ─────────────────────────────────────────────────────── */
function Badge({ children, color = "indigo" }) {
    const colors = {
        indigo: "bg-indigo-100 text-indigo-700",
        red: "bg-red-100 text-red-600",
        green: "bg-green-100 text-green-700",
        gray: "bg-gray-100 text-gray-500",
        amber: "bg-amber-100 text-amber-700",
    };
    return (
        <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors[color]}`}
        >
            {children}
        </span>
    );
}

/* ─── Program Card ────────────────────────────────────────────────────── */
function ProgramCard({ prog, onRegister }) {
    const [open, setOpen] = useState(false);
    const [regLoading, setRegLoading] = useState(false);

    const handleReg = async () => {
        let teamMemberIds = [];
        if (prog.is_team_based) {
            const input = window.prompt(
                "Enter teammate student IDs separated by commas.",
            );
            if (!input) return;
            teamMemberIds = input
                .split(",")
                .map((id) => Number(id.trim()))
                .filter(Boolean);
        }
        setRegLoading(true);
        try {
            await onRegister(prog.id, teamMemberIds);
        } finally {
            setRegLoading(false);
        }
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Top accent bar */}
            <div
                className={`h-1.5 w-full ${prog.is_graduate_restricted ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"}`}
            />
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-gray-900 text-base leading-snug">
                        {prog.name}
                    </h3>
                    <Badge color="indigo">{prog.year_name || prog.year}</Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {prog.venue && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            📍 {prog.venue}
                        </span>
                    )}
                    {prog.max_participants && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            👥 Max {prog.max_participants}
                        </span>
                    )}
                    {prog.is_team_based && (
                        <Badge color="amber">
                            Team max {prog.max_team_members}
                        </Badge>
                    )}
                    {prog.is_graduate_restricted && (
                        <Badge color="red">No Graduates</Badge>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={() => setOpen((o) => !o)}
                        className="text-xs text-indigo-600 font-medium hover:underline"
                    >
                        {open ? "Hide details ▲" : "View details ▼"}
                    </button>
                    {!prog.is_registered && (
                        <button
                            disabled={regLoading}
                            onClick={handleReg}
                            className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                        >
                            {regLoading ? "..." : "Participate"}
                        </button>
                    )}
                    {prog.is_registered && (
                        <Badge color="green">✓ Registered</Badge>
                    )}
                </div>

                {open && (
                    <div className="mt-3 space-y-3 text-sm text-gray-600">
                        {prog.description && (
                            <div>
                                <p className="font-semibold text-gray-700 mb-1">
                                    Description
                                </p>
                                <p className="leading-relaxed">
                                    {prog.description}
                                </p>
                            </div>
                        )}
                        {prog.rules && (
                            <div>
                                <p className="font-semibold text-gray-700 mb-1">
                                    Rules
                                </p>
                                <p className="leading-relaxed whitespace-pre-line">
                                    {prog.rules}
                                </p>
                            </div>
                        )}
                        {!prog.description && !prog.rules && (
                            <p className="text-gray-400 italic">
                                No additional details available.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Main Component ──────────────────────────────────────────────────── */
export default function StudentPrograms() {
    const user = useSelector(selectUser);
    const isAlumni = user?.is_alumni;
    const isDropout = user?.is_dropout;
    const canParticipate = !isAlumni && !isDropout;

    const [tab, setTab] = useState("current"); // "current" | "history"
    const [currentProgs, setCurrentProgs] = useState([]);
    const [histProgs, setHistProgs] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [alert, setAlert] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const data =
                tab === "current" && canParticipate
                    ? await getActiveProgramsAPI()
                    : await getProgramsByYearAPI(selectedYear);

            // If the API returns info about registration status, use it
            // Otherwise we might need to fetch user's participations
            if (tab === "current" && canParticipate) setCurrentProgs(data);
            else setHistProgs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [canParticipate, selectedYear, tab]);

    const handleRegister = async (id, teamMemberIds = []) => {
        try {
            const res = await registerForProgramAPI(id, teamMemberIds);
            setAlert({
                type: "success",
                msg: res.detail || "Successfully registered!",
            });
            loadData(); // Refresh list to show registration status
        } catch (err) {
            setAlert({
                type: "error",
                msg: err.response?.data?.detail || "Registration failed.",
            });
        }
        setTimeout(() => setAlert(null), 3000);
    };

    useEffect(() => {
        getAllAcademicYearsAPI()
            .then((ys) => {
                setYears(ys);
                if (ys.length > 0 && !selectedYear)
                    setSelectedYear(String(ys[0].year));
            })
            .catch(() => {});
    }, [selectedYear]);

    /* Load programs by selected year */
    useEffect(() => {
        loadData();
    }, [loadData]);

    const displayPrograms =
        tab === "current" && canParticipate ? currentProgs : histProgs;
    const filtered = displayPrograms.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.venue || "").toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* ── Header ─────────────────────────────────────────── */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Arts Fest Programs
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {isAlumni || isDropout
                            ? "You can browse historical Arts Fest programs."
                            : `Welcome, ${user?.first_name || user?.username}! Explore this year's events.`}
                    </p>
                </div>

                {/* ── Alerts ────────────────────────────────────────── */}
                {alert && (
                    <div
                        className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
                            alert.type === "success"
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    >
                        {alert.type === "success" ? "✅ " : "❌ "} {alert.msg}
                    </div>
                )}

                {/* ── Alumni notice ───────────────────────────────────── */}
                {(isAlumni || isDropout) && (
                    <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-5 py-4 text-sm">
                        <span className="text-xl">🎓</span>
                        <div>
                            <p className="font-semibold">
                                {isDropout ? "Dropout View" : "Alumni View"}
                            </p>
                            <p className="text-amber-700 mt-0.5">
                                Current active programs are not shown here.
                                You can browse past years' programs below.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Tabs ────────────────────────────────────────────── */}
                {canParticipate && (
                    <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
                        {[
                            { key: "current", label: "🎭 This Year" },
                            { key: "history", label: "📜 Past Years" },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setTab(key);
                                    setSearch("");
                                }}
                                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                    tab === key
                                        ? "bg-indigo-600 text-white shadow"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── History year picker ─────────────────────────────── */}
                {(tab === "history" || !canParticipate) && (
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <label className="text-sm font-medium text-gray-700">
                            View Year:
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {years.map((y) => (
                                <option key={y.id} value={y.year}>
                                    {y.name} ({y.year})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* ── Search ──────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search programs…"
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-72"
                    />
                    <span className="text-sm text-gray-500">
                        {filtered.length} program
                        {filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* ── Content ─────────────────────────────────────────── */}
                {loading ? (
                    <div className="flex items-center justify-center py-20 gap-3 text-indigo-500">
                        <svg
                            className="animate-spin h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                            />
                        </svg>
                        <span className="text-sm font-medium">
                            Loading programs…
                        </span>
                    </div>
                ) : tab === "current" &&
                  canParticipate &&
                  filtered.length === 0 &&
                  !search ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🎭</p>
                        <p className="text-gray-500 font-medium">
                            No active programs this year yet.
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            Check back soon — the Arts Fest is coming!
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm">
                        No programs found
                        {search ? ` for "${search}"` : " for this year"}.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((prog) => (
                            <ProgramCard
                                key={prog.id}
                                prog={prog}
                                onRegister={handleRegister}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
