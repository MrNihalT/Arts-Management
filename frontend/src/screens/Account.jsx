import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice";
import api from "../api/axios";
import { changePasswordAPI, updateUserAPI } from "../features/auth/authAPI";

/* ─── tiny helpers ──────────────────────────────────────────────────── */
const ROLE_LABELS = {
    admin: "Admin",
    principal: "Principal",
    vice_principal: "Vice Principal",
    teacher: "Teacher",
    judge: "Judge",
    student: "Student",
};

const ROLE_COLORS = {
    admin: "from-pink-500 to-orange-400",
    principal: "from-purple-500 to-pink-500",
    vice_principal: "from-blue-500 to-purple-500",
    teacher: "from-teal-500 to-cyan-400",
    judge: "from-amber-500 to-orange-400",
    student: "from-indigo-500 to-blue-400",
};

function initials(user) {
    if (user?.first_name && user?.last_name)
        return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    if (user?.username) return user.username.slice(0, 2).toUpperCase();
    return "ME";
}

/* ─── sub-components ───────────────────────────────────────────────── */

function InfoField({ label, value }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[0.65rem] font-bold tracking-[0.18em] text-gray-500 uppercase">
                {label}
            </span>
            <span className="text-white text-sm font-medium">
                {value || <span className="text-gray-600 italic">Not set</span>}
            </span>
        </div>
    );
}

function SectionHeading({ icon, title }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 text-sm">
                {icon}
            </div>
            <h2 className="text-sm font-bold tracking-widest text-gray-300 uppercase">
                {title}
            </h2>
            <div className="flex-1 h-px bg-white/5" />
        </div>
    );
}

/* ─── main component ────────────────────────────────────────────────── */
export default function Account() {
    const user = useSelector(selectUser);

    /* ── tab state ── */
    const [activeTab, setActiveTab] = useState("profile"); // profile | edit | password

    /* ── edit form ── */
    const [editForm, setEditForm] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone: user?.phone || "",
        email: user?.email || "",
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editSuccess, setEditSuccess] = useState("");
    const [editError, setEditError] = useState("");

    /* ── password form ── */
    const [pwForm, setPwForm] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwSuccess, setPwSuccess] = useState("");
    const [pwError, setPwError] = useState("");
    const [showPw, setShowPw] = useState({
        old: false,
        new: false,
        conf: false,
    });

    /* ── handlers ── */
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditSuccess("");
        setEditError("");
        try {
            await updateUserAPI(user.id, editForm);
            setEditSuccess("Profile updated successfully!");
        } catch (err) {
            setEditError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    "Update failed. Please try again.",
            );
        } finally {
            setEditLoading(false);
        }
    };

    const handlePwSubmit = async (e) => {
        e.preventDefault();
        setPwSuccess("");
        setPwError("");
        if (pwForm.new_password !== pwForm.confirm_password) {
            setPwError("New passwords do not match.");
            return;
        }
        if (pwForm.new_password.length < 8) {
            setPwError("Password must be at least 8 characters.");
            return;
        }
        setPwLoading(true);
        try {
            await changePasswordAPI({
                old_password: pwForm.old_password,
                new_password: pwForm.new_password,
            });
            setPwSuccess("Password changed successfully!");
            setPwForm({
                old_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch (err) {
            setPwError(
                err?.response?.data?.old_password?.[0] ||
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    "Failed to change password.",
            );
        } finally {
            setPwLoading(false);
        }
    };

    const roleGrad = ROLE_COLORS[user?.role] || "from-pink-500 to-orange-400";
    const tabs = [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "edit", label: "Edit Details", icon: "✏️" },
        { id: "password", label: "Change Password", icon: "🔒" },
    ];

    return (
        <div className="bg-[#0B0B13] min-h-screen font-sans text-white pb-24">
            {/* ── Hero Banner ── */}
            <section className="relative pt-24 pb-32 px-6 lg:px-12 overflow-hidden">
                {/* ambient blobs */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[120px] pointer-events-none" />
                <div className="absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-[1200px] mx-auto">
                    {/* breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-10 font-medium">
                        <Link
                            to="/"
                            className="hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <span>›</span>
                        <span className="text-white">Account</span>
                    </div>

                    {/* avatar + name row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        {/* avatar */}
                        <div className="relative">
                            <div
                                className={`w-24 h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br ${roleGrad} flex items-center justify-center text-3xl lg:text-4xl font-black text-white shadow-[0_0_40px_rgba(236,72,153,0.3)] select-none`}
                            >
                                {initials(user)}
                            </div>
                            {user?.is_approved && (
                                <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0B0B13] flex items-center justify-center text-xs">
                                    ✓
                                </span>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                                    {user?.first_name && user?.last_name
                                        ? `${user.first_name} ${user.last_name}`
                                        : user?.username || "My Account"}
                                </h1>
                                {/* role badge */}
                                <span
                                    className={`px-3 py-1 rounded-full text-[0.65rem] font-black tracking-widest uppercase bg-gradient-to-r ${roleGrad} text-white`}
                                >
                                    {ROLE_LABELS[user?.role] || user?.role}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                @{user?.username} &nbsp;·&nbsp; {user?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Content ── */}
            <section className="px-6 lg:px-12 max-w-[1200px] mx-auto -mt-16 relative z-10">
                {/* Tab Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            id={`account-tab-${t.id}`}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 ${
                                activeTab === t.id
                                    ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.35)]"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                            }`}
                        >
                            <span>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── PROFILE TAB ── */}
                {activeTab === "profile" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Personal Info */}
                        <div className="lg:col-span-2 bg-[#15151E] border border-white/5 rounded-2xl p-7">
                            <SectionHeading
                                icon="👤"
                                title="Personal Information"
                            />
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <InfoField
                                    label="First Name"
                                    value={user?.first_name}
                                />
                                <InfoField
                                    label="Last Name"
                                    value={user?.last_name}
                                />
                                <InfoField
                                    label="Username"
                                    value={user?.username}
                                />
                                <InfoField label="Email" value={user?.email} />
                                <InfoField label="Phone" value={user?.phone} />
                                <InfoField
                                    label="Role"
                                    value={
                                        ROLE_LABELS[user?.role] || user?.role
                                    }
                                />
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div className="bg-[#15151E] border border-white/5 rounded-2xl p-7 flex flex-col gap-5">
                            <SectionHeading icon="🎓" title="Academic" />
                            <InfoField
                                label="Department"
                                value={user?.department?.name}
                            />
                            <InfoField
                                label="Department Code"
                                value={user?.department?.code}
                            />
                            <InfoField
                                label="Admission Year"
                                value={user?.admission_year}
                            />
                            <InfoField
                                label="Expected Graduation"
                                value={user?.expected_graduation_year}
                            />
                            <InfoField
                                label="Alumni Status"
                                value={
                                    user?.is_alumni
                                        ? "Alumni"
                                        : "Current Student"
                                }
                            />
                            <InfoField
                                label="Team"
                                value={user?.team || "No Team Assigned"}
                            />
                        </div>

                        {/* Status cards row */}
                        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                {
                                    label: "Account Status",
                                    value: user?.is_approved
                                        ? "Approved"
                                        : "Pending",
                                    ok: user?.is_approved,
                                    icon: "✓",
                                },
                                {
                                    label: "Role",
                                    value: ROLE_LABELS[user?.role] || "—",
                                    ok: true,
                                    icon: "🔰",
                                },
                                {
                                    label: "Alumni",
                                    value: user?.is_alumni ? "Yes" : "No",
                                    ok: !user?.is_alumni,
                                    icon: "🎓",
                                },
                                {
                                    label: "Dropout",
                                    value: user?.is_dropout ? "Yes" : "No",
                                    ok: !user?.is_dropout,
                                    icon: "📋",
                                },
                            ].map((card) => (
                                <div
                                    key={card.label}
                                    className="bg-[#15151E] border border-white/5 rounded-2xl p-5 flex flex-col gap-2"
                                >
                                    <span className="text-2xl">
                                        {card.icon}
                                    </span>
                                    <span className="text-[0.6rem] font-bold tracking-widest uppercase text-gray-500">
                                        {card.label}
                                    </span>
                                    <span
                                        className={`text-sm font-bold ${card.ok ? "text-emerald-400" : "text-amber-400"}`}
                                    >
                                        {card.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── EDIT TAB ── */}
                {activeTab === "edit" && (
                    <div className="max-w-xl bg-[#15151E] border border-white/5 rounded-2xl p-8">
                        <SectionHeading icon="✏️" title="Edit Details" />

                        {editSuccess && (
                            <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                                {editSuccess}
                            </div>
                        )}
                        {editError && (
                            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
                                {editError}
                            </div>
                        )}

                        <form
                            onSubmit={handleEditSubmit}
                            className="flex flex-col gap-5"
                        >
                            {[
                                {
                                    id: "edit-first-name",
                                    label: "First Name",
                                    key: "first_name",
                                    type: "text",
                                },
                                {
                                    id: "edit-last-name",
                                    label: "Last Name",
                                    key: "last_name",
                                    type: "text",
                                },
                                {
                                    id: "edit-email",
                                    label: "Email",
                                    key: "email",
                                    type: "email",
                                },
                                {
                                    id: "edit-phone",
                                    label: "Phone",
                                    key: "phone",
                                    type: "tel",
                                },
                            ].map(({ id, label, key, type }) => (
                                <div
                                    key={key}
                                    className="flex flex-col gap-1.5"
                                >
                                    <label
                                        htmlFor={id}
                                        className="text-[0.65rem] font-bold tracking-widest uppercase text-gray-500"
                                    >
                                        {label}
                                    </label>
                                    <input
                                        id={id}
                                        type={type}
                                        value={editForm[key]}
                                        onChange={(e) =>
                                            setEditForm((f) => ({
                                                ...f,
                                                [key]: e.target.value,
                                            }))
                                        }
                                        className="bg-[#0B0B13] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-pink-500/50 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.15)] transition-all placeholder-gray-600"
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                    />
                                </div>
                            ))}

                            <button
                                id="edit-save-btn"
                                type="submit"
                                disabled={editLoading}
                                className="mt-2 w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold py-3.5 rounded-xl tracking-widest hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {editLoading ? "SAVING…" : "SAVE CHANGES"}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── PASSWORD TAB ── */}
                {activeTab === "password" && (
                    <div className="max-w-xl bg-[#15151E] border border-white/5 rounded-2xl p-8">
                        <SectionHeading icon="🔒" title="Change Password" />

                        {pwSuccess && (
                            <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                                {pwSuccess}
                            </div>
                        )}
                        {pwError && (
                            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
                                {pwError}
                            </div>
                        )}

                        <form
                            onSubmit={handlePwSubmit}
                            className="flex flex-col gap-5"
                        >
                            {[
                                {
                                    id: "pw-old",
                                    label: "Current Password",
                                    key: "old_password",
                                    vis: "old",
                                    placeholder: "Enter current password",
                                },
                                {
                                    id: "pw-new",
                                    label: "New Password",
                                    key: "new_password",
                                    vis: "new",
                                    placeholder: "Min. 8 characters",
                                },
                                {
                                    id: "pw-conf",
                                    label: "Confirm New Password",
                                    key: "confirm_password",
                                    vis: "conf",
                                    placeholder: "Repeat new password",
                                },
                            ].map(({ id, label, key, vis, placeholder }) => (
                                <div
                                    key={key}
                                    className="flex flex-col gap-1.5"
                                >
                                    <label
                                        htmlFor={id}
                                        className="text-[0.65rem] font-bold tracking-widest uppercase text-gray-500"
                                    >
                                        {label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id={id}
                                            type={
                                                showPw[vis]
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={pwForm[key]}
                                            onChange={(e) =>
                                                setPwForm((f) => ({
                                                    ...f,
                                                    [key]: e.target.value,
                                                }))
                                            }
                                            placeholder={placeholder}
                                            className="w-full bg-[#0B0B13] border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm outline-none focus:border-pink-500/50 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.15)] transition-all placeholder-gray-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPw((s) => ({
                                                    ...s,
                                                    [vis]: !s[vis],
                                                }))
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs"
                                        >
                                            {showPw[vis] ? "HIDE" : "SHOW"}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* password strength hint */}
                            {pwForm.new_password && (
                                <div className="text-xs text-gray-500 -mt-2">
                                    Strength:{" "}
                                    <span
                                        className={`font-bold ${
                                            pwForm.new_password.length >= 12
                                                ? "text-emerald-400"
                                                : pwForm.new_password.length >=
                                                    8
                                                  ? "text-amber-400"
                                                  : "text-red-400"
                                        }`}
                                    >
                                        {pwForm.new_password.length >= 12
                                            ? "Strong"
                                            : pwForm.new_password.length >= 8
                                              ? "Medium"
                                              : "Weak"}
                                    </span>
                                    <div className="mt-1.5 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                pwForm.new_password.length >= 12
                                                    ? "w-full bg-emerald-500"
                                                    : pwForm.new_password
                                                            .length >= 8
                                                      ? "w-2/3 bg-amber-500"
                                                      : "w-1/3 bg-red-500"
                                            }`}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                id="pw-save-btn"
                                type="submit"
                                disabled={pwLoading}
                                className="mt-2 w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold py-3.5 rounded-xl tracking-widest hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {pwLoading ? "UPDATING…" : "UPDATE PASSWORD"}
                            </button>
                        </form>
                    </div>
                )}
            </section>
        </div>
    );
}
