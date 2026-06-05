import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import {
    getUserByIdAPI,
    approveUserAPI,
    rejectUserAPI,
    assignRoleAPI,
    updateUserAPI,
    getDepartmentsAPI,
    getAcademicYearsAPI,
    assignDepartmentAPI,
} from "../features/auth/authAPI";

const ROLE_COLORS = {
    admin: "bg-red-100 text-red-700",
    principal: "bg-orange-100 text-orange-700",
    teacher: "bg-blue-100 text-blue-700",
    judge: "bg-purple-100 text-purple-700",
    student: "bg-gray-100 text-gray-600",
};

export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approving, setApproving] = useState(false);
    const [actionError, setActionError] = useState(null);

    const loggedInUser = useSelector(selectUser);
    const canAssignRole =
        loggedInUser?.role === "admin" || loggedInUser?.role === "principal";

    const [selectedRole, setSelectedRole] = useState("");
    const [assigningRole, setAssigningRole] = useState(false);

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [assigningDepartment, setAssigningDepartment] = useState(false);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [savingEdit, setSavingEdit] = useState(false);

    useEffect(() => {
        if (canAssignRole) {
            getDepartmentsAPI().then(setDepartments).catch(console.error);
            getAcademicYearsAPI().then(setAcademicYears).catch(console.error);
        }
    }, [canAssignRole]);

    useEffect(() => {
        getUserByIdAPI(id)
            .then(setUser)
            .catch(() => setError("Failed to load user details."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleApprove = async () => {
        setApproving(true);
        setActionError(null);
        try {
            await approveUserAPI(user.id);
            setUser({ ...user, is_approved: true });
        } catch {
            setActionError("Failed to approve user. Please try again.");
        } finally {
            setApproving(false);
        }
    };

    const handleReject = async () => {
        setApproving(true);
        setActionError(null);
        try {
            await rejectUserAPI(user.id);
            setUser({ ...user, is_approved: false });
        } catch {
            setActionError(
                `Failed to ${user.is_approved ? "delete" : "reject"} user. Please try again.`,
            );
        } finally {
            setApproving(false);
            navigate("/admin");
        }
    };

    const handleAssignRole = async () => {
        if (!selectedRole) return;
        setAssigningRole(true);
        setActionError(null);
        try {
            await assignRoleAPI(user.id, selectedRole);
            setUser({ ...user, role: selectedRole });
            setSelectedRole("");
        } catch (err) {
            setActionError(
                err.response?.data?.error ||
                    "Failed to assign role. Please try again.",
            );
        } finally {
            setAssigningRole(false);
        }
    };

    const handleToggleAlumni = async () => {
        setApproving(true);
        setActionError(null);
        try {
            const updated = await updateUserAPI(user.id, {
                is_alumni: !user.is_alumni,
            });
            setUser({ ...user, is_alumni: updated.is_alumni });
        } catch {
            setActionError("Failed to update alumni status.");
        } finally {
            setApproving(false);
        }
    };

    const handleToggleDropout = async () => {
        setApproving(true);
        setActionError(null);
        try {
            const updated = await updateUserAPI(user.id, {
                is_dropout: !user.is_dropout,
            });
            setUser({ ...user, is_dropout: updated.is_dropout });
        } catch {
            setActionError("Failed to update dropout status.");
        } finally {
            setApproving(false);
        }
    };

    const handleEditToggle = () => {
        if (!isEditing) {
            setEditForm({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                department_id: user.department?.id || "",
                admission_year_id: user.admission_year || "",
                expected_graduation_year: user.expected_graduation_year || "",
            });
        }
        setIsEditing(!isEditing);
        setActionError(null);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async () => {
        setSavingEdit(true);
        setActionError(null);
        try {
            const payload = { ...editForm };
            if (!payload.department_id) payload.department_id = null;
            if (!payload.admission_year_id) payload.admission_year_id = null;
            if (!payload.expected_graduation_year)
                payload.expected_graduation_year = null;

            const updatedUser = await updateUserAPI(user.id, payload);
            setUser({ ...user, ...updatedUser });
            setIsEditing(false);
        } catch (err) {
            setActionError(
                err.response?.data?.error || "Failed to update user details.",
            );
        } finally {
            setSavingEdit(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <svg
                        className="animate-spin h-8 w-8 text-indigo-500"
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
                    <p className="text-sm">Loading user…</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-sm font-medium mb-4">
                        {error || "User not found."}
                    </p>
                    <button
                        onClick={() => navigate("/admin")}
                        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        ← Back to Admin
                    </button>
                </div>
            </div>
        );
    }

    const fullName =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.username;
    const initials = (
        user.first_name?.[0] ??
        user.username?.[0] ??
        "U"
    ).toUpperCase();

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-10">
            <div className="max-w-3xl mx-auto space-y-5">
                {/* Back */}
                <button
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                >
                    ← Back to Admin Dashboard
                </button>

                {/* Profile card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Cover */}
                    <div className="h-28 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative">
                        <div className="absolute -bottom-10 left-8">
                            {user.profile_photo ? (
                                <img
                                    src={user.profile_photo}
                                    alt={fullName}
                                    className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                    {initials}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Header info */}
                    <div className="pt-14 px-8 pb-6 flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {fullName}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                @{user.username} &nbsp;·&nbsp; ID #{user.id}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-600"}`}
                            >
                                {user.role}
                            </span>
                            <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${user.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                            >
                                {user.is_approved ? "✓ Approved" : "⏳ Pending"}
                            </span>
                            {user.is_alumni && (
                                <span className="text-xs font-bold px-3 py-1 bg-gray-800 text-white rounded-full">
                                    🎓 Alumni
                                </span>
                            )}
                            {user.is_dropout && (
                                <span className="text-xs font-bold px-3 py-1 bg-red-700 text-white rounded-full">
                                    Dropout
                                </span>
                            )}
                        </div>
                        {isEditing && (
                            <div className="sm:col-span-2 mt-2 flex justify-end">
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={savingEdit}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-70"
                                >
                                    {savingEdit ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Personal info */}
                <Section title="Personal Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {isEditing ? (
                            <>
                                <EditField
                                    label="First Name"
                                    name="first_name"
                                    value={editForm.first_name}
                                    onChange={handleEditChange}
                                />
                                <EditField
                                    label="Last Name"
                                    name="last_name"
                                    value={editForm.last_name}
                                    onChange={handleEditChange}
                                />
                                <EditField
                                    label="Username"
                                    name="username"
                                    value={editForm.username}
                                    onChange={handleEditChange}
                                />
                                <Field label="User ID" value={`#${user.id}`} />
                                <EditField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                />
                                <EditField
                                    label="Phone"
                                    name="phone"
                                    value={editForm.phone}
                                    onChange={handleEditChange}
                                />
                            </>
                        ) : (
                            <>
                                <Field
                                    label="First Name"
                                    value={user.first_name}
                                />
                                <Field
                                    label="Last Name"
                                    value={user.last_name}
                                />
                                <Field
                                    label="Username"
                                    value={`@${user.username}`}
                                />
                                <Field label="User ID" value={`#${user.id}`} />
                                <Field label="Email" value={user.email} />
                                <Field label="Phone" value={user.phone} />
                            </>
                        )}
                    </div>
                </Section>

                {/* Academic info */}
                <Section title="Academic Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {isEditing ? (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                                        Admission Year
                                    </label>
                                    <select
                                        name="admission_year_id"
                                        value={editForm.admission_year_id}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition"
                                    >
                                        <option value="">Select Year...</option>
                                        {academicYears.map((y) => (
                                            <option key={y.id} value={y.id}>
                                                {y.name} ({y.year})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <EditField
                                    label="Expected Graduation"
                                    name="expected_graduation_year"
                                    type="number"
                                    value={editForm.expected_graduation_year}
                                    onChange={handleEditChange}
                                />
                            </>
                        ) : (
                            <>
                                <Field
                                    label="Admission Year (ID)"
                                    value={user.admission_year || "Not set"}
                                />
                                <Field
                                    label="Expected Graduation"
                                    value={
                                        user.expected_graduation_year ||
                                        "Not set"
                                    }
                                />
                            </>
                        )}
                    </div>
                </Section>

                {/* Department */}
                <Section title="Department">
                    {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                                    Change Department
                                </label>
                                <select
                                    name="department_id"
                                    value={editForm.department_id}
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition"
                                >
                                    <option value="">No Department</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : user.department ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <Field label="Name" value={user.department.name} />
                            <Field label="Code" value={user.department.code} />
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                                    Status
                                </p>
                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${user.department.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                                >
                                    {user.department.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">
                            No department assigned.
                        </p>
                    )}
                </Section>

                {/* Role & access */}
                <Section title="Role & Access">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                                Role
                            </p>
                            <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-600"}`}
                            >
                                {user.role}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                                Approval Status
                            </p>
                            <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${user.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                            >
                                {user.is_approved
                                    ? "✓ Approved"
                                    : "⏳ Pending Approval"}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                                Student Status
                            </p>
                            <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                    user.is_dropout || user.is_alumni
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                {user.is_dropout
                                    ? "Dropout"
                                    : user.is_alumni
                                      ? "Alumni"
                                      : "Current Student"}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-5 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                            Actions
                        </p>
                        <div className="flex items-center gap-3">
                            {!user.is_approved ? (
                                <>
                                    <button
                                        onClick={handleApprove}
                                        disabled={approving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold rounded-lg transition-colors"
                                    >
                                        {approving
                                            ? "Processing…"
                                            : "✓ Approve User"}
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={approving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 border border-red-200 text-sm font-semibold rounded-lg transition-colors"
                                    >
                                        {approving ? "…" : "✕ Reject"}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleReject}
                                        disabled={approving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 border border-red-200 text-sm font-semibold rounded-lg transition-colors"
                                    >
                                        {approving ? "…" : "✕ Delete User"}
                                    </button>
                                    <button
                                        onClick={handleToggleAlumni}
                                        disabled={approving}
                                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                                            user.is_alumni
                                                ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                                : "bg-gray-800 hover:bg-gray-900 text-white"
                                        }`}
                                    >
                                        {approving
                                            ? "Updating…"
                                            : user.is_alumni
                                              ? "Undo Alumni Status"
                                              : "🎓 Mark as Alumni"}
                                    </button>
                                    <button
                                        onClick={handleToggleDropout}
                                        disabled={approving}
                                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                                            user.is_dropout
                                                ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                                                : "bg-red-700 hover:bg-red-800 text-white"
                                        }`}
                                    >
                                        {approving
                                            ? "Updating..."
                                            : user.is_dropout
                                              ? "Undo Dropout Status"
                                              : "Mark as Dropout"}
                                    </button>

                                    {canAssignRole && (
                                        <button
                                            onClick={handleEditToggle}
                                            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                                                isEditing
                                                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                                            }`}
                                        >
                                            {isEditing
                                                ? "✕ Cancel Editing"
                                                : "✏️ Edit Profile"}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        {actionError && (
                            <p className="mt-3 text-sm text-red-500">
                                {actionError}
                            </p>
                        )}

                        {canAssignRole && (
                            <div className="mt-6 pt-5 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                                    Change User Role
                                </p>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={selectedRole}
                                        onChange={(e) =>
                                            setSelectedRole(e.target.value)
                                        }
                                        className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                                        disabled={assigningRole}
                                    >
                                        <option value="">
                                            Select a new role...
                                        </option>
                                        <option value="student">Student</option>
                                        <option value="judge">Judge</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="admin">Admin</option>
                                        <option value="principal">
                                            Principal
                                        </option>
                                    </select>
                                    <button
                                        onClick={handleAssignRole}
                                        disabled={
                                            assigningRole || !selectedRole
                                        }
                                        className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:bg-violet-400 text-white text-sm font-semibold rounded-lg transition-colors"
                                    >
                                        {assigningRole
                                            ? "Assigning..."
                                            : "Assign"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Section>

                {/* Department */}
                <Section title="Department">
                    {user.department ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <Field label="Name" value={user.department.name} />
                            <Field label="Code" value={user.department.code} />
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                                    Status
                                </p>
                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${user.department.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                                >
                                    {user.department.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">
                            No department assigned.
                        </p>
                    )}
                </Section>

                {/* Team */}
                <Section title="Team">
                    {user.team ? (
                        <Field
                            label="Team Name"
                            value={user.team.name ?? user.team}
                        />
                    ) : (
                        <p className="text-sm text-gray-400">
                            No team assigned.
                        </p>
                    )}
                </Section>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">{title}</h2>
            {children}
        </div>
    );
}

function Field({ label, value }) {
    return (
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                {label}
            </p>
            <p className="text-sm font-medium text-gray-900">
                {value || <span className="text-gray-300">Not provided</span>}
            </p>
        </div>
    );
}

function EditField({ label, name, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
        </div>
    );
}
