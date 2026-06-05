import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDepartmentByIdAPI } from "../features/auth/authAPI";

export default function Department() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDept = async () => {
            setLoading(true);
            try {
                const data = await getDepartmentByIdAPI(id);
                setDepartment(data);
            } catch {
                setError("Failed to fetch department details.");
            } finally {
                setLoading(false);
            }
        };
        fetchDept();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
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
                    <p className="text-sm font-medium">Loading department…</p>
                </div>
            </div>
        );
    }

    if (error || !department) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-red-500 text-sm font-medium mb-4">
                        {error || "Department not found."}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    const ROLE_COLORS = {
        admin: "bg-red-100 text-red-700 border border-red-200",
        principal: "bg-orange-100 text-orange-700 border border-orange-200",
        teacher: "bg-blue-100 text-blue-700 border border-blue-200",
        judge: "bg-purple-100 text-purple-700 border border-purple-200",
        student: "bg-gray-100 text-gray-600 border border-gray-200",
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-indigo-50/40 px-4 sm:px-6 py-10">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                >
                    ← Back
                </button>

                {/* Header Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl text-indigo-500 drop-shadow-sm">
                                🏢
                            </span>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {department.name}
                            </h1>
                        </div>
                        <p className="text-gray-500 flex items-center gap-2">
                            Department Code:{" "}
                            <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-sm border border-indigo-100">
                                {department.code}
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <span
                            className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                                department.is_active
                                    ? "bg-green-500 text-white border border-green-600"
                                    : "bg-gray-500 text-white border border-gray-600"
                            }`}
                        >
                            {department.is_active ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group">
                        <div className="w-14 h-14 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors flex items-center justify-center text-2xl">
                            👥
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                Total Members
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {department.members?.length || 0}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group">
                        <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center text-2xl">
                            🏆
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                Teams Assigned
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {department.teams?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Members List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span>People in {department.name}</span>
                            <span className="bg-gray-100 text-gray-600 text-xs py-1 px-2.5 rounded-full font-semibold border border-gray-200">
                                {department.members?.length || 0}
                            </span>
                        </h2>

                        {department.members?.length > 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                <ul className="divide-y divide-gray-50">
                                    {department.members.map((member) => (
                                        <li
                                            key={member.id}
                                            className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/users/${member.id}`,
                                                )
                                            }
                                        >
                                            <div className="flex items-center gap-4">
                                                {member.profile_photo ? (
                                                    <img
                                                        src={
                                                            member.profile_photo
                                                        }
                                                        alt={member.username}
                                                        className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-lg shadow-sm">
                                                        {(
                                                            member
                                                                .first_name?.[0] ||
                                                            member
                                                                .username?.[0] ||
                                                            "?"
                                                        ).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 flex items-center">
                                                        {member.first_name ||
                                                        member.last_name
                                                            ? `${member.first_name} ${member.last_name}`
                                                            : member.username}
                                                        {member.is_approved ? (
                                                            <span
                                                                className="text-green-500 ml-1.5 text-xs bg-green-50 px-1 rounded-full border border-green-100"
                                                                title="Approved"
                                                            >
                                                                ✓
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className="text-yellow-500 ml-1.5 text-[10px] bg-yellow-50 px-1 rounded-full border border-yellow-100"
                                                                title="Pending Approval"
                                                            >
                                                                ⏳
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {member.email ||
                                                            "No email"}{" "}
                                                        •{" "}
                                                        {member.phone ||
                                                            "No phone"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <span
                                                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                                                        ROLE_COLORS[
                                                            member.role
                                                        ] || ROLE_COLORS.student
                                                    }`}
                                                >
                                                    {member.role}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
                                <span className="text-4xl opacity-50 mb-3 block">
                                    👻
                                </span>
                                <p className="text-gray-500 font-medium">
                                    No members found in this department.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Teams Sidebar */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Associated Teams
                        </h2>

                        {department.teams?.length > 0 ? (
                            <div className="space-y-3">
                                {department.teams.map((team) => (
                                    <div
                                        key={team.id}
                                        className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {team.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Team ID: #{team.id}
                                                </p>
                                            </div>
                                            <span
                                                className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                                                    team.is_active
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                            ></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200 border-dashed">
                                <span className="text-2xl mb-2 block">🚩</span>
                                <p className="text-sm text-gray-400 font-medium">
                                    No teams assigned yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
