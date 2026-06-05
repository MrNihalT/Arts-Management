import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { selectUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { getProgramsAPI } from "../features/auth/authAPI";

export default function AnnouncementCreate() {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [activeTab, setActiveTab] = useState(
        isEditMode ? "edit" : "schedule",
    );

    const [announcementForm, setAnnouncementForm] = useState({
        title: "",
        message: "",
        link: "",
        is_active: true,
    });

    const [scheduleForm, setScheduleForm] = useState({
        program: "",
        message: "",
        start_at: "",
    });

    const [programs, setPrograms] = useState([]);
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        api.get(`/schedule/schedule/${id}/`)
            .then((res) => {
                const data = res.data;

                setScheduleForm({
                    program: data.program?.id || data.program || "",
                    message: data.message || "",
                    start_at: data.start_at
                        ? new Date(data.start_at).toISOString().slice(0, 16)
                        : "",
                });

                setActiveTab("edit");
            })
            .catch((err) => {
                setError(
                    err.response?.data
                        ? JSON.stringify(err.response.data)
                        : "Failed to load schedule.",
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleUpdateSchedule = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                ...scheduleForm,
                start_at: scheduleForm.start_at
                    ? new Date(scheduleForm.start_at).toISOString()
                    : "",
            };

            await api.patch(`/schedule/schedule/${id}/`, payload);

            setSuccess("Schedule updated successfully!");
        } catch (err) {
            setError(
                err.response?.data
                    ? JSON.stringify(err.response.data)
                    : "Something went wrong.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProgramsAPI({ all: true })
            .then((data) => setPrograms(data))
            .catch((err) => console.error("Failed to load programs", err));
    }, []);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmitAnnouncement = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await api.post("/announcements/", announcementForm);
            setSuccess("Announcement created successfully!");
            setAnnouncementForm({
                title: "",
                message: "",
                link: "",
                is_active: true,
            });
        } catch (err) {
            setError(
                err.response?.data
                    ? JSON.stringify(err.response.data)
                    : "Something went wrong.",
            );
        } finally {
            setLoading(false);
        }
    };

    /* ── Submit: Schedule ────────────────────────────────────── */
    const handleSubmitSchedule = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const payload = {
                ...scheduleForm,
                start_at: scheduleForm.start_at
                    ? new Date(scheduleForm.start_at).toISOString()
                    : "",
            };
            await api.post("/schedule/schedule/", payload);
            setSuccess("Schedule created successfully!");
            setScheduleForm({ program: "", message: "", start_at: "" });
        } catch (err) {
            setError(
                err.response?.data
                    ? JSON.stringify(err.response.data)
                    : "Something went wrong.",
            );
        } finally {
            setLoading(false);
        }
    };

    const inputCls =
        "w-full px-4 py-3 bg-[#0B0B13] border border-white/5 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all";
    const labelCls =
        "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2";

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#0B0B13] relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-3xl mx-auto px-6 py-10 relative z-10">
                {/* ── Page header ── */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 tracking-wider">
                        {activeTab === "schedule"
                            ? "Create Schedule"
                            : "Create Announcement"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium tracking-widest uppercase">
                        Welcome back, {user?.first_name || user?.username}
                    </p>
                </div>

                {/* ── Tab switcher ── */}
                {!isEditMode && (
                    <div className="flex gap-2 mb-8 p-1 bg-[#15151E] border border-white/5 rounded-xl w-fit">
                        {[
                            { key: "schedule", label: "📅 Schedule" },
                            { key: "announcement", label: "📢 Announcement" },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setActiveTab(key);
                                    setError(null);
                                    setSuccess(null);
                                }}
                                className={`px-5 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${
                                    activeTab === key
                                        ? "bg-gradient-to-r from-pink-600 to-orange-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                                        : "text-gray-500 hover:text-white"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Card ── */}
                <div className="bg-[#15151E] border border-white/5 rounded-2xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                    {/* Error / Success banners */}
                    {error && (
                        <div className="mb-5 p-3 bg-red-500/15 text-red-400 text-sm rounded-xl border border-red-500/30">
                            ⚠️ {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-5 p-3 bg-green-500/15 text-green-400 text-sm rounded-xl border border-green-500/30">
                            ✅ {success}
                        </div>
                    )}



                    {/* ════════════════ SCHEDULE FORM ════════════════ */}
                    {activeTab === "schedule" && (
                        <form
                            onSubmit={handleSubmitSchedule}
                            className="space-y-5"
                        >
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-white">
                                    New Schedule
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    Set the program, date/time and optional
                                    notes.
                                </p>
                            </div>

                            {/* Program select */}
                            <div>
                                <label
                                    htmlFor="schedule-program"
                                    className={labelCls}
                                >
                                    Program
                                </label>
                                <select
                                    id="schedule-program"
                                    value={scheduleForm.program}
                                    onChange={(e) =>
                                        setScheduleForm({
                                            ...scheduleForm,
                                            program: e.target.value,
                                        })
                                    }
                                    required
                                    className={inputCls}
                                >
                                    <option value="" disabled>
                                        {programs.length === 0
                                            ? "Loading programs…"
                                            : "Select a program"}
                                    </option>
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                                {scheduleForm.program &&
                                    (() => {
                                        const selected = programs.find(
                                            (p) =>
                                                p.id.toString() ===
                                                scheduleForm.program.toString(),
                                        );
                                        return selected?.venue ? (
                                            <p className="text-gray-500 text-xs mt-1.5">
                                                📍 Venue:{" "}
                                                <span className="text-gray-300">
                                                    {selected.venue}
                                                </span>
                                            </p>
                                        ) : null;
                                    })()}
                            </div>

                            {/* Start date & time */}
                            <div>
                                <label
                                    htmlFor="schedule-start-at"
                                    className={labelCls}
                                >
                                    Start Date &amp; Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="schedule-start-at"
                                    value={scheduleForm.start_at}
                                    onChange={(e) =>
                                        setScheduleForm({
                                            ...scheduleForm,
                                            start_at: e.target.value,
                                        })
                                    }
                                    required
                                    className={
                                        inputCls + " [color-scheme:dark]"
                                    }
                                />
                            </div>

                            {/* Notes / message */}
                            <div>
                                <label
                                    htmlFor="schedule-message"
                                    className={labelCls}
                                >
                                    Notes{" "}
                                    <span className="normal-case text-gray-600">
                                        (optional)
                                    </span>
                                </label>
                                <textarea
                                    id="schedule-message"
                                    value={scheduleForm.message}
                                    onChange={(e) =>
                                        setScheduleForm({
                                            ...scheduleForm,
                                            message: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    className={inputCls}
                                    placeholder="Any extra info about this schedule…"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-full hover:bg-white/10 transition-all tracking-widest uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white text-xs font-bold rounded-full hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Saving…" : "Create Schedule"}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ════════════════ ANNOUNCEMENT FORM ════════════════ */}
                    {activeTab === "announcement" && (
                        <form
                            onSubmit={handleSubmitAnnouncement}
                            className="space-y-5"
                        >
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-white">
                                    New Announcement
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    Broadcast a message to all users.
                                </p>
                            </div>

                            {/* Title */}
                            <div>
                                <label htmlFor="ann-title" className={labelCls}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="ann-title"
                                    value={announcementForm.title}
                                    onChange={(e) =>
                                        setAnnouncementForm({
                                            ...announcementForm,
                                            title: e.target.value,
                                        })
                                    }
                                    required
                                    className={inputCls}
                                    placeholder="Announcement title"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="ann-message"
                                    className={labelCls}
                                >
                                    Message
                                </label>
                                <textarea
                                    id="ann-message"
                                    value={announcementForm.message}
                                    onChange={(e) =>
                                        setAnnouncementForm({
                                            ...announcementForm,
                                            message: e.target.value,
                                        })
                                    }
                                    rows={4}
                                    required
                                    className={inputCls}
                                    placeholder="Write your announcement…"
                                />
                            </div>

                            {/* Link */}
                            <div>
                                <label htmlFor="ann-link" className={labelCls}>
                                    Link{" "}
                                    <span className="normal-case text-gray-600">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    type="url"
                                    id="ann-link"
                                    value={announcementForm.link}
                                    onChange={(e) =>
                                        setAnnouncementForm({
                                            ...announcementForm,
                                            link: e.target.value,
                                        })
                                    }
                                    className={inputCls}
                                    placeholder="https://example.com"
                                />
                            </div>

                            {/* Active toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="ann-active"
                                    checked={announcementForm.is_active}
                                    onChange={(e) =>
                                        setAnnouncementForm({
                                            ...announcementForm,
                                            is_active: e.target.checked,
                                        })
                                    }
                                    className="w-4 h-4 accent-pink-500"
                                />
                                <label
                                    htmlFor="ann-active"
                                    className="text-sm text-gray-400 font-bold uppercase tracking-widest"
                                >
                                    Publish immediately
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-full hover:bg-white/10 transition-all tracking-widest uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white text-xs font-bold rounded-full hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Posting…" : "Post Announcement"}
                                </button>
                            </div>
                        </form>
                    )}
                    {activeTab === "edit" && (
                        <form
                            onSubmit={handleUpdateSchedule}
                            className="space-y-5"
                        >
                            <h2 className="text-xl font-bold text-white">
                                Edit Schedule
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Update the selected schedule details.
                            </p>

                            {/* Program select */}
                            <div>
                                <label
                                    htmlFor="schedule-program"
                                    className={labelCls}
                                >
                                    Program
                                </label>
                                <select
                                    id="schedule-program"
                                    value={scheduleForm.program}
                                    onChange={(e) =>
                                        setScheduleForm({
                                            ...scheduleForm,
                                            program: e.target.value,
                                        })
                                    }
                                    required
                                    className={inputCls}
                                >
                                    <option value="" disabled>
                                        {programs.length === 0
                                            ? "Loading programs…"
                                            : "Select a program"}
                                    </option>
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                                {scheduleForm.program &&
                                    (() => {
                                        const selected = programs.find(
                                            (p) =>
                                                p.id.toString() ===
                                                scheduleForm.program.toString(),
                                        );
                                        return selected?.venue ? (
                                            <p className="text-gray-500 text-xs mt-1.5">
                                                📍 Venue:{" "}
                                                <span className="text-gray-300">
                                                    {selected.venue}
                                                </span>
                                            </p>
                                        ) : null;
                                    })()}
                            </div>

                            {/* Start date & time */}
                            <div>
                                <label
                                    htmlFor="schedule-start-at"
                                    className={labelCls}
                                >
                                    Start Date &amp; Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="schedule-start-at"
                                    value={scheduleForm.start_at}
                                    onChange={(e) =>
                                        setScheduleForm({
                                            ...scheduleForm,
                                            start_at: e.target.value,
                                        })
                                    }
                                    required
                                    className={
                                        inputCls + " [color-scheme:dark]"
                                    }
                                />
                            </div>

                            {/* Notes / message */}
                            <div>
                                <label
                                    htmlFor="schedule-message"
                                    className={labelCls}
                                >
                                    Notes{" "}
                                    <span className="normal-case text-gray-600">
                                        (optional)
                                    </span>
                                </label>
                                <textarea
                                    id="schedule-message"
                                    value={scheduleForm.message}
                                    onChange={(e) =>
                                        setScheduleForm({
                                            ...scheduleForm,
                                            message: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    className={inputCls}
                                    placeholder="Any extra info about this schedule…"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-full hover:bg-white/10 transition-all tracking-widest uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white text-xs font-bold rounded-full hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Updating…" : "Update Schedule"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
