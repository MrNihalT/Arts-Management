import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useSelector } from "react-redux";
import { getDepartmentsAPI, getProgramsAPI } from "../features/auth/authAPI";
import * as XLSX from "xlsx";

/* ─── helpers ─────────────────────────────────────────────────────── */
function initials(name = "") {
    return name.slice(0, 2).toUpperCase();
}

const DEPT_COLORS = [
    "from-pink-500 to-rose-400",
    "from-violet-500 to-purple-400",
    "from-blue-500 to-cyan-400",
    "from-emerald-500 to-teal-400",
    "from-amber-500 to-orange-400",
    "from-indigo-500 to-blue-400",
    "from-fuchsia-500 to-pink-400",
    "from-sky-500 to-blue-400",
];

function deptColor(dept = "") {
    let hash = 0;
    for (let i = 0; i < dept.length; i++)
        hash = dept.charCodeAt(i) + ((hash << 5) - hash);
    return DEPT_COLORS[Math.abs(hash) % DEPT_COLORS.length];
}

/* ─── sub-components ────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub }) {
    return (
        <div className="bg-[#15151E] border border-white/5 rounded-2xl p-5 flex flex-col gap-1.5">
            <span className="text-xl">{icon}</span>
            <span className="text-2xl font-black text-white">{value}</span>
            <span className="text-[0.65rem] font-bold tracking-widest uppercase text-gray-500">
                {label}
            </span>
            {sub && <span className="text-[0.7rem] text-gray-600">{sub}</span>}
        </div>
    );
}

function SkeletonRow() {
    return (
        <tr className="border-b border-white/5 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <td key={i} className="px-4 py-4">
                    <div className="h-3 bg-white/5 rounded-full w-3/4" />
                </td>
            ))}
        </tr>
    );
}

function MemberChip({ username, department }) {
    return (
        <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2.5 py-1.5 text-[0.65rem] font-bold text-gray-300">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-[0.5rem] font-black text-white shrink-0">
                {username?.[0]?.toUpperCase()}
            </span>
            <span>{username}</span>
            {department && (
                <span className="bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold">
                    {department}
                </span>
            )}
        </span>
    );
}

/* ─── main component ─────────────────────────────────────────────── */
export default function Participations() {
    const [participations, setParticipations] = useState([]);
    const [allPrograms, setAllPrograms] = useState([]);
    const [selectedProgramId, setSelectedProgramId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* filters */
    const [search, setSearch] = useState("");
    const [filterDept, setFilterDept] = useState("ALL");
    const [filterTeam, setFilterTeam] = useState("ALL");
    const [sortField, setSortField] = useState("user");
    const [sortAsc, setSortAsc] = useState(true);

    /* expanded row for team members */
    const [expandedRow, setExpandedRow] = useState(null);

    const getParticipations = async (progId = selectedProgramId) => {
        try {
            setLoading(true);
            setError("");
            const url = progId
                ? `/participations/program/${progId}/`
                : "/participations/list/";
            const response = await api.get(url);
            setParticipations(response.data);
        } catch (err) {
            console.log(err);
            setError("Failed to fetch participations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProgramsList = async () => {
        try {
            const progs = await getProgramsAPI({ all: true });
            setAllPrograms(progs);
        } catch (err) {
            console.error("Error fetching programs:", err);
        }
    };

    useEffect(() => {
        fetchProgramsList();
    }, []);

    useEffect(() => {
        getParticipations(selectedProgramId);
    }, [selectedProgramId]);
    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getDepartmentsAPI();
                setDepartments(["ALL", ...response.map((dept) => dept.name)]);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, [participations]);

    const teams = useMemo(() => {
        const s = new Set(participations.map((p) => p.team).filter(Boolean));
        return ["ALL", ...s];
    }, [participations]);

    const filtered = useMemo(() => {
        let list = [...participations];
        if (search)
            list = list.filter(
                (p) =>
                    p.user?.toLowerCase().includes(search.toLowerCase()) ||
                    p.program?.toLowerCase().includes(search.toLowerCase()) ||
                    p.department?.toLowerCase().includes(search.toLowerCase()),
            );
        if (filterDept !== "ALL")
            list = list.filter((p) => p.department === filterDept);
        if (filterTeam !== "ALL")
            list = list.filter((p) => p.team === filterTeam);
        list.sort((a, b) => {
            const av = (a[sortField] || "").toString().toLowerCase();
            const bv = (b[sortField] || "").toString().toLowerCase();
            return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return list;
    }, [participations, search, filterDept, filterTeam, sortField, sortAsc]);

    const stats = useMemo(() => {
        const uniqueUsers = new Set(participations.map((p) => p.user)).size;
        const uniquePrograms = new Set(participations.map((p) => p.program))
            .size;
        const uniqueDepts = new Set(
            participations.map((p) => p.department).filter(Boolean),
        ).size;
        return {
            total: participations.length,
            uniqueUsers,
            uniquePrograms,
            uniqueDepts,
        };
    }, [participations]);

    const handleSort = (field) => {
        if (sortField === field) setSortAsc((a) => !a);
        else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const SortIcon = ({ field }) => (
        <span
            className={`ml-1 text-[0.6rem] ${sortField === field ? "text-pink-400" : "text-gray-600"}`}
        >
            {sortField === field ? (sortAsc ? "▲" : "▼") : "⇅"}
        </span>
    );

    const handlePrint = () => {
        window.print();
    };

    const handleExportExcel = () => {
        const dataToExport = filtered.map((p) => ({
            Participant: p.user,
            Program: p.program || "—",
            Department: p.department || "—",
            Team: p.team || "—",
            Fest: p.arts_fest || "—",
            "Team Members":
                p.team_members?.length > 0
                    ? p.team_members
                          .map((m) =>
                              m.department
                                  ? `${m.username} (${m.department})`
                                  : m.username,
                          )
                          .join(", ")
                    : "Solo",
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Participations");

        const fileName = `${selectedProgramName.replace(/\s+/g, "_")}_Participations.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    const selectedProgramName = useMemo(() => {
        return (
            allPrograms.find((p) => p.id.toString() === selectedProgramId)
                ?.name || "All Participations"
        );
    }, [allPrograms, selectedProgramId]);

    return (
        <div className="bg-[#0B0B13] min-h-screen font-sans text-white pb-24">
            {/* ── Print Styles ── */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    nav, aside, button, .print-hidden { display: none !important; }
                    body { background: white !important; color: black !important; font-size: 12px !important; }
                    .print-container { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
                    .print-card { border: 1px solid #ccc !important; background: white !important; color: black !important; }
                    .print-table th { background: #f0f0f0 !important; color: black !important; border-bottom: 2px solid #ccc !important; font-size: 11px !important; }
                    .print-table td { color: black !important; border-bottom: 1px solid #eee !important; }
                    .print-title { display: block !important; color: black !important; margin-bottom: 20px !important; }
                    .bg-\\[\\#0B0B13\\], .bg-\\[\\#15151E\\], .bg-\\[\\#0F0F1A\\] { background: white !important; }
                    .text-white, .text-gray-300, .text-gray-400, .text-gray-500 { color: black !important; }
                    .border-white\\/5, .border-white\\/10 { border-color: #eee !important; }
                    .print-member-list { display: block !important; font-size: 10px; color: #555; margin-top: 3px; }
                    .print-member-dept { color: #888; font-style: italic; }
                }
                .print-title { display: none; }
                .print-member-list { display: none; }
            `,
                }}
            />

            {/* ── Hero ── */}
            <section className="relative pt-24 pb-16 px-6 lg:px-12 overflow-hidden print-hidden">
                <div className="absolute top-0 left-1/3 w-[500px] h-[400px] rounded-full bg-pink-600/8 blur-[120px] pointer-events-none" />
                <div className="absolute top-10 right-1/4 w-[350px] h-[350px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-[1400px] mx-auto">
                    {/* breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
                        <Link
                            to="/"
                            className="hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <span>›</span>
                        <Link
                            to="/admin"
                            className="hover:text-white transition-colors"
                        >
                            Admin
                        </Link>
                        <span>›</span>
                        <span className="text-white">Participations</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-1">
                                PARTICIPATIONS
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {selectedProgramId
                                    ? `Program: ${selectedProgramName}`
                                    : "All event registrations across departments & programs"}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleExportExcel}
                                className="flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-6 py-3 rounded-full tracking-widest hover:bg-emerald-600/20 transition-all print-hidden"
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
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Export Excel
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-white/5 border border-white/10 text-white text-xs font-bold px-6 py-3 rounded-full tracking-widest hover:bg-white/10 transition-all print-hidden"
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
                                        strokeWidth={2}
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    />
                                </svg>
                                Print List
                            </button>
                            <button
                                id="reload-participations-btn"
                                onClick={() => getParticipations()}
                                disabled={loading}
                                className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold px-6 py-3 rounded-full tracking-widest hover:shadow-[0_0_18px_rgba(236,72,153,0.4)] transition-all disabled:opacity-50"
                            >
                                <svg
                                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                {loading ? "Loading…" : "Refresh"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-6 lg:px-12 max-w-[1400px] mx-auto space-y-8 print-container">
                {/* Print Only Header */}
                <div className="print-title text-center">
                    <h1 className="text-3xl font-bold">
                        Arts Festival Participation List
                    </h1>
                    <p className="text-lg">{selectedProgramName}</p>
                    <p className="text-sm">
                        Generated on: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print-hidden">
                    <StatCard
                        icon="🎭"
                        label="Total Entries"
                        value={stats.total}
                    />
                    <StatCard
                        icon="👤"
                        label="Participants"
                        value={stats.uniqueUsers}
                    />
                    <StatCard
                        icon="🎯"
                        label="Programs"
                        value={stats.uniquePrograms}
                    />
                    <StatCard
                        icon="🏛️"
                        label="Departments"
                        value={stats.uniqueDepts}
                    />
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">
                        <span className="text-lg">⚠️</span>
                        {error}
                        <button
                            onClick={getParticipations}
                            className="ml-auto text-xs font-bold underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ── Filters ── */}
                <div className="bg-[#15151E] border border-white/5 rounded-2xl p-5 flex flex-col lg:flex-row gap-4 print-hidden">
                    {/* search */}
                    <div className="relative flex-1">
                        <svg
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            id="participation-search"
                            type="text"
                            placeholder="Search by user, program, department…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#0B0B13] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-pink-500/50 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.12)] transition-all"
                        />
                    </div>

                    {/* program filter (Backend-linked) */}
                    <select
                        id="filter-program-backend"
                        value={selectedProgramId}
                        onChange={(e) => setSelectedProgramId(e.target.value)}
                        className="bg-[#0B0B13] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500/50 transition-all min-w-[200px]"
                    >
                        <option value="">All Programs</option>
                        {allPrograms.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    {/* dept filter */}
                    <select
                        id="filter-department"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="bg-[#0B0B13] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500/50 transition-all min-w-[160px]"
                    >
                        {departments.map((d) => (
                            <option key={d} value={d}>
                                {d === "ALL" ? "All Departments" : d}
                            </option>
                        ))}
                    </select>

                    {/* team filter */}
                    <select
                        id="filter-team"
                        value={filterTeam}
                        onChange={(e) => setFilterTeam(e.target.value)}
                        className="bg-[#0B0B13] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500/50 transition-all min-w-[160px]"
                    >
                        {teams.map((t) => (
                            <option key={t} value={t}>
                                {t === "ALL" ? "All Teams" : t}
                            </option>
                        ))}
                    </select>

                    {/* result count */}
                    <div className="flex items-center text-xs text-gray-500 font-medium whitespace-nowrap self-center">
                        <span className="text-pink-400 font-bold">
                            {filtered.length}
                        </span>
                        &nbsp;result{filtered.length !== 1 ? "s" : ""}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="bg-[#15151E] border border-white/5 rounded-2xl overflow-hidden print-card">
                    <div className="overflow-x-auto print-container">
                        <table className="w-full min-w-[700px] print-table">
                            <thead>
                                <tr className="border-b border-white/5 bg-[#0F0F1A]">
                                    {[
                                        { label: "Participant", field: "user" },
                                        { label: "Program", field: "program" },
                                        {
                                            label: "Department",
                                            field: "department",
                                        },
                                        { label: "Team", field: "team" },
                                        { label: "Fest", field: "arts_fest" },
                                        { label: "Team Members", field: null },
                                    ].map(({ label, field }) => (
                                        <th
                                            key={label}
                                            onClick={() =>
                                                field && handleSort(field)
                                            }
                                            className={`px-5 py-3.5 text-left text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 ${field ? "cursor-pointer hover:text-white transition-colors select-none" : ""}`}
                                        >
                                            {label}
                                            {field && (
                                                <SortIcon field={field} />
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-20 text-center text-gray-600"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <span className="text-4xl">
                                                    🎭
                                                </span>
                                                <p className="font-medium">
                                                    No participations found
                                                </p>
                                                {(search ||
                                                    filterDept !== "ALL" ||
                                                    filterTeam !== "ALL") && (
                                                    <button
                                                        onClick={() => {
                                                            setSearch("");
                                                            setFilterDept(
                                                                "ALL",
                                                            );
                                                            setFilterTeam(
                                                                "ALL",
                                                            );
                                                        }}
                                                        className="text-pink-400 text-xs font-bold hover:text-pink-300 transition-colors"
                                                    >
                                                        Clear filters
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((p, idx) => {
                                        const grad = deptColor(
                                            p.department || "",
                                        );
                                        const isExpanded = expandedRow === idx;
                                        const hasMembers =
                                            p.team_members?.length > 0;
                                        return (
                                            <React.Fragment key={idx}>
                                                <tr
                                                    onClick={() =>
                                                        hasMembers &&
                                                        setExpandedRow(
                                                            isExpanded
                                                                ? null
                                                                : idx,
                                                        )
                                                    }
                                                    className={`border-b border-white/5 transition-all duration-200 ${hasMembers ? "cursor-pointer" : ""} ${isExpanded ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"}`}
                                                >
                                                    {/* Participant */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${grad} flex items-center justify-center text-[0.6rem] font-black text-white shrink-0`}
                                                            >
                                                                {initials(
                                                                    p.user,
                                                                )}
                                                            </div>
                                                            <span className="font-semibold text-sm text-white">
                                                                {p.user}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Program */}
                                                    <td className="px-5 py-4">
                                                        <span className="px-2.5 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-300 text-[0.7rem] font-bold rounded-full">
                                                            {p.program || "—"}
                                                        </span>
                                                    </td>

                                                    {/* Department */}
                                                    <td className="px-5 py-4 text-sm text-gray-300">
                                                        {p.department || (
                                                            <span className="text-gray-600 italic">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Team */}
                                                    <td className="px-5 py-4">
                                                        {p.team ? (
                                                            <span className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[0.7rem] font-bold rounded-full">
                                                                {p.team}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-600 text-sm italic">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Fest */}
                                                    <td className="px-5 py-4 text-sm text-gray-400">
                                                        {p.arts_fest || "—"}
                                                    </td>

                                                    {/* Members toggle */}
                                                    <td className="px-5 py-4">
                                                        {hasMembers ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[0.65rem] font-bold text-gray-500">
                                                                    {
                                                                        p
                                                                            .team_members
                                                                            .length
                                                                    }{" "}
                                                                    member
                                                                    {p
                                                                        .team_members
                                                                        .length !==
                                                                    1
                                                                        ? "s"
                                                                        : ""}
                                                                </span>
                                                                <span
                                                                    className={`text-gray-500 text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                                                >
                                                                    ▾
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-700 text-xs">
                                                                Solo
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>

                                                {/* Expanded members row (screen) */}
                                                {isExpanded && (
                                                    <tr className="bg-[#0F0F1A] border-b border-white/5">
                                                        <td
                                                            colSpan={6}
                                                            className="px-5 py-4"
                                                        >
                                                            <div className="flex flex-wrap gap-2 pl-11">
                                                                {p.team_members.map(
                                                                    (m, mi) => (
                                                                        <MemberChip
                                                                            key={mi}
                                                                            username={m.username}
                                                                            department={m.department}
                                                                        />
                                                                    ),
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}

                                                {/* Print-only inline member list */}
                                                {hasMembers && (
                                                    <tr className="print-member-list">
                                                        <td colSpan={6} className="px-5 pb-3">
                                                            <span className="print-member-list" style={{display:'none'}}>
                                                                <strong>Team Members: </strong>
                                                                {p.team_members.map((m, mi) => (
                                                                    <span key={mi}>
                                                                        {m.username}
                                                                        {m.department && (
                                                                            <span className="print-member-dept"> ({m.department})</span>
                                                                        )}
                                                                        {mi < p.team_members.length - 1 ? ", " : ""}
                                                                    </span>
                                                                ))}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* table footer */}
                    {!loading && filtered.length > 0 && (
                        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between print-hidden">
                            <span className="text-[0.65rem] text-gray-600 font-medium tracking-wider">
                                SHOWING {filtered.length} OF{" "}
                                {participations.length} ENTRIES
                            </span>
                            <span className="text-[0.65rem] text-gray-700">
                                Click a row with team members to expand ▾
                            </span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
