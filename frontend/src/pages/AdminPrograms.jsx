import { useCallback, useEffect, useState } from "react";
import {
    getAllAcademicYearsAPI,
    getProgramsAPI,
    createProgramAPI,
    updateProgramAPI,
    deleteProgramAPI,
    getArtsFestsAPI,
} from "../features/auth/authAPI";

/* ─── helpers ─────────────────────────────────────────────────────────── */
const EMPTY_FORM = {
    name: "",
    arts_fest: "",
    eligible_batches: [],
    description: "",
    venue: "",
    max_participants: "",
    rules: "",
    last_date: "",
    is_active: true,
    is_graduate_restricted: true,
    is_team_based: false,
    max_team_members: "",
};

function errMsg(err) {
    const data = err?.response?.data;
    if (!data) return "Something went wrong.";
    return Object.entries(data)
        .map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(", ") : m}`)
        .join(" • ");
}

/* ─── Toggle button ───────────────────────────────────────────────────── */
function Toggle({ value, onChange, label }) {
    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
                    value ? "bg-indigo-600" : "bg-gray-300"
                }`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        value ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </button>
            <span className="text-sm text-gray-700 font-medium">{label}</span>
        </div>
    );
}

/* ─── Main Component ──────────────────────────────────────────────────── */
export default function AdminPrograms() {
    const [years, setYears] = useState([]);
    const [fests, setFests] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [yearFilter, setYearFilter] = useState("all");
    const [activeFilter, setActiveFilter] = useState("all");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(false);
    const [search, setSearch] = useState("");

    /* load initial data */
    useEffect(() => {
        getAllAcademicYearsAPI()
            .then(setYears)
            .catch(() => {});
        getArtsFestsAPI()
            .then(setFests)
            .catch(() => {});
    }, []);

    /* load programs */
    const loadPrograms = useCallback(() => {
        setLoading(true);
        const params = { all: true };
        if (yearFilter !== "all") params.year = yearFilter;
        if (activeFilter !== "all") params.active = activeFilter === "active";
        getProgramsAPI(params)
            .then(setPrograms)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [activeFilter, yearFilter]);

    useEffect(() => {
        loadPrograms();
    }, [loadPrograms]);

    /* filtered by search */
    const filtered = programs.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.venue || "").toLowerCase().includes(search.toLowerCase()),
    );

    /* form helpers */
    const openCreate = () => {
        setEditId(null);
        setForm(EMPTY_FORM);
        setFormError(null);
        setFormSuccess(false);
        setShowForm(true);
    };

    const openEdit = (prog) => {
        setEditId(prog.id);
        setForm({
            name: prog.name,
            arts_fest: prog.arts_fest,
            eligible_batches: prog.eligible_batches ?? [],
            description: prog.description ?? "",
            venue: prog.venue ?? "",
            max_participants: prog.max_participants ?? "",
            rules: prog.rules ?? "",
            last_date: prog.last_date ?? "",
            is_active: prog.is_active,
            is_graduate_restricted: prog.is_graduate_restricted,
            is_team_based: prog.is_team_based ?? false,
            max_team_members: prog.max_team_members ?? "",
            event_image: prog.event_image ?? "",
        });
        setFormError(null);
        setFormSuccess(false);
        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            // Store the actual File object, not the fake path string
            setForm((f) => ({ ...f, [name]: files[0] || null }));
        } else if (type === "checkbox" && name === "eligible_batches") {
            const numValue = Number(value);
            setForm((f) => ({
                ...f,
                eligible_batches: checked
                    ? [...f.eligible_batches, numValue]
                    : f.eligible_batches.filter((id) => id !== numValue),
            }));
        } else {
            setForm((f) => ({ ...f, [name]: value }));
        }
        setFormError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        setFormSuccess(false);

        // Build FormData so the image file is sent as multipart/form-data
        const fd = new FormData();
        fd.append("name", form.name);
        if (form.arts_fest) fd.append("arts_fest", form.arts_fest);
        form.eligible_batches.forEach((id) => fd.append("eligible_batches", id));
        fd.append("description", form.description);
        fd.append("venue", form.venue);
        if (form.max_participants !== "") fd.append("max_participants", Number(form.max_participants));
        fd.append("rules", form.rules);
        if (form.last_date) fd.append("last_date", form.last_date);
        fd.append("is_active", form.is_active);
        fd.append("is_graduate_restricted", form.is_graduate_restricted);
        fd.append("is_team_based", form.is_team_based);
        if (form.is_team_based && form.max_team_members !== "") {
            fd.append("max_team_members", Number(form.max_team_members));
        }
        // Only append image if the user selected a new file
        if (form.event_image instanceof File) {
            fd.append("event_image", form.event_image);
        }

        try {
            if (editId) {
                await updateProgramAPI(editId, fd);
            } else {
                await createProgramAPI(fd);
            }
            setFormSuccess(true);
            loadPrograms();
            setTimeout(() => {
                setShowForm(false);
                setFormSuccess(false);
                setEditId(null);
            }, 1200);
        } catch (err) {
            setFormError(errMsg(err));
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this program? This cannot be undone."))
            return;
        try {
            await deleteProgramAPI(id);
            loadPrograms();
        } catch {
            alert("Delete failed.");
        }
    };

    const handleToggleActive = async (prog) => {
        try {
            await updateProgramAPI(prog.id, { is_active: !prog.is_active });
            loadPrograms();
        } catch {
            alert("Could not update program.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* ── Header ─────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Arts Programs
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Manage yearly Arts Fest events
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        + New Program
                    </button>
                </div>

                {/* ── Create / Edit Form ──────────────────────────────── */}
                {showForm && (
                    <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center gap-3">
                            <span className="text-white text-lg">🎭</span>
                            <h2 className="text-white font-semibold text-base">
                                {editId ? "Edit Program" : "New Program"}
                            </h2>
                        </div>

                        <div className="p-6">
                            {formSuccess && (
                                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-lg px-4 py-3">
                                    ✅ Program {editId ? "updated" : "created"}{" "}
                                    successfully!
                                </div>
                            )}
                            {formError && (
                                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Program Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Solo Dance"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>

                                    {/* Arts Fest */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Arts Fest{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            name="arts_fest"
                                            value={form.arts_fest}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        >
                                            <option value="">
                                                — Select Fest —
                                            </option>
                                            {fests.map((f) => (
                                                <option key={f.id} value={f.id}>
                                                    {f.name} ({f.year})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Event Image{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="file"
                                            name="event_image"
                                            onChange={handleChange}
                                            required
                                            accept="image/*"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                        {form.event_image && (
                                            <div className="mt-2">
                                                <img
                                                    src={
                                                        form.event_image instanceof File
                                                            ? URL.createObjectURL(form.event_image)
                                                            : `http://localhost:8000${form.event_image}`
                                                    }
                                                    alt="Event Preview"
                                                    className="h-32 rounded-lg object-cover border border-gray-200"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {/* Eligible Batches */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Eligible Batches{" "}
                                            <span className="text-gray-400 font-normal">
                                                (Leave empty to allow all
                                                current students)
                                            </span>
                                        </label>
                                        <div className="flex flex-wrap gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50 max-h-32 overflow-y-auto">
                                            {years.map((y) => (
                                                <label
                                                    key={y.id}
                                                    className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded border border-gray-200 hover:border-indigo-300 transition-colors"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="eligible_batches"
                                                        value={y.id}
                                                        checked={form.eligible_batches.includes(
                                                            y.id,
                                                        )}
                                                        onChange={handleChange}
                                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {y.name} ({y.year})
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Venue */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Venue{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="venue"
                                            value={form.venue}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. College Auditorium"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>

                                    {/* Max participants — shown only in the non-team section below */}
                                </div>

                                {/* Description */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Short description of the program…"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                                    />
                                </div>

                                {/* Rules */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Rules
                                    </label>
                                    <textarea
                                        name="rules"
                                        value={form.rules}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Participation rules…"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                                    />
                                </div>

                                {/* Toggles */}
                                <div className="flex flex-wrap gap-8 mb-6">
                                    <Toggle
                                        value={form.is_active}
                                        onChange={(v) =>
                                            setForm((f) => ({
                                                ...f,
                                                is_active: v,
                                            }))
                                        }
                                        label={`Visible to students (${form.is_active ? "Active" : "Hidden"})`}
                                    />
                                    <Toggle
                                        value={form.is_graduate_restricted}
                                        onChange={(v) =>
                                            setForm((f) => ({
                                                ...f,
                                                is_graduate_restricted: v,
                                            }))
                                        }
                                        label={`Block graduates (${form.is_graduate_restricted ? "Yes" : "No"})`}
                                    />
                                    <Toggle
                                        value={form.is_team_based}
                                        onChange={(v) =>
                                            setForm((f) => ({
                                                ...f,
                                                is_team_based: v,
                                                // clear team fields if toggled off
                                                max_team_members: v
                                                    ? f.max_team_members
                                                    : "",
                                            }))
                                        }
                                        label={`Team-based event (${form.is_team_based ? "Yes" : "No — Solo"})`}
                                    />
                                </div>

                                {/* Team fields — only visible when is_team_based = true */}
                                {form.is_team_based && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
                                        <div className="sm:col-span-2">
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
                                                🏆 Team Settings
                                            </p>
                                        </div>
                                        {/* Max total participants (across all teams) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Max Total Participants
                                            </label>
                                            <input
                                                type="number"
                                                name="max_participants"
                                                value={form.max_participants}
                                                onChange={handleChange}
                                                min="1"
                                                placeholder="e.g. 40"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                            />
                                        </div>
                                        {/* Max members per team */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Max Members per Team{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                name="max_team_members"
                                                value={form.max_team_members}
                                                onChange={handleChange}
                                                min="2"
                                                required={form.is_team_based}
                                                placeholder="e.g. 5"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Last date & non-team max_participants */}
                                {!form.is_team_based && (
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Max Participants
                                        </label>
                                        <input
                                            type="number"
                                            name="max_participants"
                                            value={form.max_participants}
                                            onChange={handleChange}
                                            min="1"
                                            placeholder="Leave blank for unlimited"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        />
                                    </div>
                                )}

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Last Date to Register{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="last_date"
                                        value={form.last_date}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditId(null);
                                        }}
                                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold transition-colors"
                                    >
                                        {formLoading ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-4 w-4 text-white"
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
                                                Saving…
                                            </>
                                        ) : editId ? (
                                            "Update Program"
                                        ) : (
                                            "Create Program"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Filters ─────────────────────────────────────────── */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search programs…"
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Years</option>
                        {years.map((y) => (
                            <option key={y.id} value={y.year}>
                                {y.name} ({y.year})
                            </option>
                        ))}
                    </select>
                    <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                    <span className="ml-auto self-center text-sm text-gray-500">
                        {filtered.length} program
                        {filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* ── Table ───────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center gap-3">
                        <span className="text-white text-lg">🎭</span>
                        <h2 className="text-white font-semibold text-base">
                            All Programs
                        </h2>
                    </div>

                    {loading ? (
                        <div className="px-6 py-14 text-center text-gray-400 text-sm">
                            Loading…
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="px-6 py-14 text-center text-gray-400 text-sm">
                            No programs found. Create the first one!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        {[
                                            "#",
                                            "Name",
                                            "Fest",
                                            "Year",
                                            "Venue",
                                            "Max",
                                            "Status",
                                            "Actions",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((prog, i) => (
                                        <tr
                                            key={prog.id}
                                            className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                                        >
                                            <td className="px-5 py-3.5 text-gray-400">
                                                {i + 1}
                                            </td>
                                            <td className="px-5 py-3.5 font-semibold text-gray-800">
                                                {prog.name}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600">
                                                {prog.arts_fest_name || "—"}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600">
                                                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                                    {prog.year}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600">
                                                {prog.venue || (
                                                    <span className="text-gray-300">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600">
                                                {prog.max_participants ?? (
                                                    <span className="text-gray-300">
                                                        ∞
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button
                                                    onClick={() =>
                                                        handleToggleActive(prog)
                                                    }
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                                                        prog.is_active
                                                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                    }`}
                                                    title="Click to toggle active"
                                                >
                                                    {prog.is_active
                                                        ? "Active"
                                                        : "Hidden"}
                                                </button>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                        prog.is_graduate_restricted
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-blue-100 text-blue-600"
                                                    }`}
                                                >
                                                    {prog.is_graduate_restricted
                                                        ? "Blocked"
                                                        : "Allowed"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEdit(prog)
                                                        }
                                                        className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                prog.id,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
