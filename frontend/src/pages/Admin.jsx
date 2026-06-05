import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    selectUser,
    selectDepartments,
    fetchDepartments,
} from "../features/auth/authSlice";
import { createDepartmentAPI, getUsersAPI } from "../features/auth/authAPI";

function Admin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const departments = useSelector(selectDepartments);
    const [showCreateDepartment, setShowCreateDepartment] = useState(false);
    const [showDeptList, setShowDeptList] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    // Department form state
    const [deptForm, setDeptForm] = useState({
        name: "",
        code: "",
        is_active: true,
    });
    const [deptLoading, setDeptLoading] = useState(false);
    const [deptError, setDeptError] = useState(null);
    const [deptSuccess, setDeptSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            user.username?.toLowerCase().includes(query) ||
            user.first_name?.toLowerCase().includes(query) ||
            user.last_name?.toLowerCase().includes(query);
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    useEffect(() => {
        if (departments.length === 0) {
            dispatch(fetchDepartments());
        }
    }, [dispatch, departments.length]);

    useEffect(() => {
        setUsersLoading(true);
        getUsersAPI()
            .then((data) => {
                setUsers(data);
            })
            .finally(() => {
                setUsersLoading(false);
            });
    }, [showUserList]);
    const handleDeptChange = (e) => {
        const { name, type, checked, value } = e.target;
        setDeptForm({
            ...deptForm,
            [name]: type === "checkbox" ? checked : value,
        });
        setDeptError(null);
    };

    const handleDeptSubmit = async (e) => {
        e.preventDefault();
        setDeptLoading(true);
        setDeptError(null);
        setDeptSuccess(false);
        try {
            await createDepartmentAPI(deptForm);
            setDeptSuccess(true);
            setDeptForm({ name: "", code: "", is_active: true });
            dispatch(fetchDepartments()); // refresh the list
            setTimeout(() => {
                setShowCreateDepartment(false);
                setDeptSuccess(false);
            }, 1500);
        } catch (err) {
            const data = err.response?.data;
            const messages = data
                ? Object.entries(data)
                      .map(
                          ([f, m]) =>
                              `${f}: ${Array.isArray(m) ? m.join(", ") : m}`,
                      )
                      .join(" • ")
                : "Something went wrong.";
            setDeptError(messages);
        } finally {
            setDeptLoading(false);
        }
    };
    const showdepartments = () => {
        setShowDeptList((prev) => !prev);
    };
    const showusers = async () => {
        setShowUserList((prev) => !prev);
        // Only fetch if not already loaded
        if (!showUserList && users.length === 0) {
            setUsersLoading(true);
            try {
                const data = await getUsersAPI();
                setUsers(data);
            } catch (err) {
                console.log(err);
            } finally {
                setUsersLoading(false);
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#0B0B13] relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 tracking-wider">
                            ADMIN DASHBOARD
                        </h1>
                        <p className="text-gray-400 text-sm mt-1 font-bold tracking-widest uppercase">
                            Welcome back, {user?.first_name || user?.username}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to="/admin/create-user"
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold rounded-full hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all tracking-wider uppercase no-underline"
                        >
                            + Create User
                        </Link>
                        <Link
                            to="/participations"
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all tracking-wider uppercase no-underline"
                        >
                            🎭 Participation
                        </Link>
                        <Link
                            to="/admin/programs"
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-bold rounded-full hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all tracking-wider uppercase no-underline"
                        >
                            🎭 Programs
                        </Link>
                        <Link
                            to="/admin/announcement"
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-bold rounded-full hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all tracking-wider uppercase no-underline"
                        >
                            🎭 Announcements
                        </Link>
                        <Link
                            to="/admin/scoreupload"
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-bold rounded-full hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all tracking-wider uppercase no-underline"
                        >
                            🎭 Upload Score
                        </Link>
                        <button
                            onClick={() => {
                                setShowCreateDepartment(!showCreateDepartment);
                                setDeptError(null);
                                setDeptSuccess(false);
                            }}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#11111A] border border-white/10 hover:border-white/30 text-white text-xs font-bold rounded-full transition-all tracking-wider uppercase"
                        >
                            {showCreateDepartment ? "✕ Cancel" : "+ Department"}
                        </button>
                    </div>
                </div>

                {/* Create Department inline form */}
                {showCreateDepartment && (
                    <div className="mb-8 bg-[#11111A]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
                        {/* Form header strip */}
                        <div className="px-6 py-4 bg-gradient-to-r from-pink-600 to-orange-500 flex items-center gap-3">
                            <span className="text-white text-lg">🏫</span>
                            <h2 className="text-white font-bold tracking-wider text-sm uppercase">
                                New Department
                            </h2>
                        </div>

                        <div className="p-6">
                            {/* Success */}
                            {deptSuccess && (
                                <div className="mb-4 flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold tracking-wide rounded-xl px-4 py-3 uppercase">
                                    ✅ Department created successfully!
                                </div>
                            )}

                            {/* Error */}
                            {deptError && (
                                <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wide rounded-xl px-4 py-3 uppercase">
                                    {deptError}
                                </div>
                            )}

                            <form onSubmit={handleDeptSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                    {/* Department Name */}
                                    <div>
                                        <label className="block text-xs font-bold tracking-wider text-gray-300 mb-2 uppercase">
                                            Department Name{" "}
                                            <span className="text-pink-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={deptForm.name}
                                            onChange={handleDeptChange}
                                            placeholder="e.g. Computer Science"
                                            required
                                            className="w-full bg-[#0B0B13]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                        />
                                    </div>

                                    {/* Department Code */}
                                    <div>
                                        <label className="block text-xs font-bold tracking-wider text-gray-300 mb-2 uppercase">
                                            Department Code{" "}
                                            <span className="text-pink-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={deptForm.code}
                                            onChange={handleDeptChange}
                                            placeholder="e.g. CS"
                                            required
                                            className="w-full bg-[#0B0B13]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Is Active toggle */}
                                <div className="flex items-center gap-3 mb-6">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeptForm({
                                                ...deptForm,
                                                is_active: !deptForm.is_active,
                                            })
                                        }
                                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
                                            deptForm.is_active
                                                ? "bg-pink-600"
                                                : "bg-gray-700"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                                                deptForm.is_active
                                                    ? "translate-x-5"
                                                    : "translate-x-0"
                                            }`}
                                        />
                                    </button>
                                    <span className="text-xs text-gray-300 font-bold tracking-wider uppercase">
                                        Active{" "}
                                        <span className="text-gray-500 font-normal">
                                            (
                                            {deptForm.is_active
                                                ? "enabled"
                                                : "disabled"}
                                            )
                                        </span>
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCreateDepartment(false)
                                        }
                                        className="px-6 py-3.5 rounded-xl border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/5 transition-colors uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={deptLoading}
                                        className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-500 hover:to-orange-400 disabled:opacity-50 text-white text-xs font-bold transition-all uppercase tracking-wider"
                                    >
                                        {deptLoading ? (
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
                                                Creating…
                                            </>
                                        ) : (
                                            "Create Department"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <StatCard
                        icon="🏫"
                        label="DEPARTMENTS"
                        value={departments.length}
                        color="pink"
                        onClick={showdepartments}
                    />
                    <StatCard
                        icon="👥"
                        label="TOTAL USERS"
                        value={users.length || "—"}
                        color="orange"
                        onClick={showusers}
                    />
                    <StatCard
                        icon="✅"
                        label="REQUESTS"
                        value="—"
                        color="purple"
                    />
                </div>

                {/* Departments List */}
                {showDeptList && (
                    <div className="bg-[#11111A]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden mb-8">
                        <div className="px-6 py-4 bg-gradient-to-r from-pink-600 to-pink-500 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-white text-lg">🏫</span>
                                <h2 className="text-white font-bold tracking-wider text-sm uppercase">
                                    All Departments
                                </h2>
                            </div>
                            <span className="text-pink-200 text-xs font-bold tracking-wider uppercase">
                                {departments.length} total
                            </span>
                        </div>

                        {departments.length === 0 ? (
                            <div className="px-6 py-10 text-center text-gray-400 text-sm">
                                No departments found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-[#1A1A24]">
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                #
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Name
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Code
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departments.map((dept, i) => (
                                            <tr
                                                onClick={() =>
                                                    navigate(
                                                        `/department/${dept.id}`,
                                                    )
                                                }
                                                key={dept.id}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4 text-gray-500 font-medium">
                                                    {i + 1}
                                                </td>
                                                <td className="px-6 py-4 text-gray-200 font-bold tracking-wide">
                                                    {dept.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-white/10 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-md tracking-wider">
                                                        {dept.code}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-md tracking-wider uppercase ${
                                                            dept.is_active
                                                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                                        }`}
                                                    >
                                                        {dept.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {/* Users List */}
                {showUserList && (
                    <div className="bg-[#11111A]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden mb-8">
                        <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-white text-lg">👥</span>
                                <h2 className="text-white font-bold tracking-wider text-sm uppercase">
                                    All Users
                                </h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <form className="flex flex-wrap gap-2 text-white">
                                    <input
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        type="text"
                                        placeholder="Search users..."
                                        className="px-4 py-2 text-xs font-bold tracking-wider bg-[#0B0B13]/50 border border-white/20 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder-white/50"
                                    />
                                    <select
                                        value={roleFilter}
                                        onChange={(e) =>
                                            setRoleFilter(e.target.value)
                                        }
                                        className="px-4 py-2 text-xs font-bold tracking-wider bg-[#0B0B13]/50 border border-white/20 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white uppercase [&>option]:bg-[#11111A] [&>option]:text-white"
                                    >
                                        <option value="all">ALL ROLES</option>
                                        <option value="student">STUDENT</option>
                                        <option value="judge">JUDGE</option>
                                        <option value="teacher">TEACHER</option>
                                        <option value="admin">ADMIN</option>
                                        <option value="principal">
                                            PRINCIPAL
                                        </option>
                                    </select>
                                </form>
                                <span className="text-white/80 text-xs font-bold tracking-wider uppercase hidden sm:block">
                                    {filteredUsers.length} total
                                </span>
                            </div>
                        </div>

                        {usersLoading ? (
                            <div className="px-6 py-10 text-center text-gray-400 text-sm">
                                Loading users…
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="px-6 py-10 text-center text-gray-400 text-sm">
                                No users found matching your search.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-[#1A1A24]">
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                #
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Username
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Name
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Email
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Role
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Department
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Approved
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u, i) => (
                                            <tr
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/users/${u.id}`,
                                                    )
                                                }
                                                key={u.id}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4 text-gray-500 font-medium">
                                                    {i + 1}
                                                </td>
                                                <td className="px-6 py-4 text-gray-200 font-bold">
                                                    {u.username}
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    {u.first_name ||
                                                    u.last_name ? (
                                                        `${u.first_name} ${u.last_name}`.trim()
                                                    ) : (
                                                        <span className="text-gray-600">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    {u.email || (
                                                        <span className="text-gray-600">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`text-[0.65rem] font-bold px-3 py-1.5 rounded-md tracking-wider uppercase border ${
                                                            u.role === "admin"
                                                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                                : u.role ===
                                                                    "principal"
                                                                  ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                                                                  : u.role ===
                                                                      "teacher"
                                                                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                                                    : u.role ===
                                                                        "judge"
                                                                      ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                                                      : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                                        }`}
                                                    >
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    {u.department?.name || (
                                                        <span className="text-gray-600">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`text-[0.65rem] font-bold px-3 py-1.5 rounded-md tracking-wider uppercase border ${
                                                            u.is_approved
                                                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                                        }`}
                                                    >
                                                        {u.is_approved
                                                            ? "Yes"
                                                            : "Pending"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color, onClick }) {
    const colors = {
        pink: "bg-[#11111A]/80 border-white/10 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] text-white",
        orange: "bg-[#11111A]/80 border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] text-white",
        purple: "bg-[#11111A]/80 border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] text-white",
    };
    return (
        <div
            onClick={onClick}
            className={`rounded-2xl border p-6 flex items-center gap-5 transition-all duration-300 backdrop-blur-md ${
                onClick ? "cursor-pointer hover:-translate-y-1" : ""
            } ${colors[color]}`}
        >
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-3xl border border-white/5">
                {icon}
            </div>
            <div>
                <p className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
                    {value}
                </p>
                <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mt-1">
                    {label}
                </p>
            </div>
        </div>
    );
}

export default Admin;
