import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    selectUser,
    selectDepartments,
    fetchDepartments,
} from "../features/auth/authSlice";
import { getUsersAPI } from "../features/auth/authAPI";

function Teacher() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const departments = useSelector(selectDepartments);
    const [users, setUsers] = useState([]);
    const [showUserList, setShowUserList] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);

    useEffect(() => {
        if (departments.length == 0) {
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
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Teacher Dashboard
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Welcome back, {user?.first_name || user?.username}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin/create-user"
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm no-underline"
                        >
                            + Create User
                        </Link>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <StatCard
                        icon="👥"
                        label="Total Users"
                        value={users.length || "—"}
                        color="violet"
                        onClick={showusers}
                    />
                    <StatCard
                        icon="✅"
                        label="requests"
                        value="—"
                        color="emerald"
                    />
                </div>

                {/* Users List */}
                {showUserList && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                        <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-white text-lg">👥</span>
                                <h2 className="text-white font-semibold text-base">
                                    All Users
                                </h2>
                            </div>
                            <span className="text-violet-200 text-sm">
                                {users.length} total
                            </span>
                        </div>

                        {usersLoading ? (
                            <div className="px-6 py-10 text-center text-gray-400 text-sm">
                                Loading users…
                            </div>
                        ) : users.length === 0 ? (
                            <div className="px-6 py-10 text-center text-gray-400 text-sm">
                                No users found.
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            #
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Username
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Name
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Email
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Role
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Department
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Approved
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, i) => (
                                        <tr
                                            onClick={() =>
                                                navigate(`/admin/users/${u.id}`)
                                            }
                                            key={u.id}
                                            className="border-b border-gray-50 hover:bg-violet-50/40 transition-colors"
                                        >
                                            <td className="px-6 py-3.5 text-gray-400 font-medium">
                                                {i + 1}
                                            </td>
                                            <td className="px-6 py-3.5 text-gray-800 font-semibold">
                                                {u.username}
                                            </td>
                                            <td className="px-6 py-3.5 text-gray-700">
                                                {u.first_name || u.last_name ? (
                                                    `${u.first_name} ${u.last_name}`.trim()
                                                ) : (
                                                    <span className="text-gray-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5 text-gray-500">
                                                {u.email || (
                                                    <span className="text-gray-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                                                        u.role === "admin"
                                                            ? "bg-red-100 text-red-700"
                                                            : u.role ===
                                                                "principal"
                                                              ? "bg-orange-100 text-orange-700"
                                                              : u.role ===
                                                                  "teacher"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : u.role ===
                                                                    "judge"
                                                                  ? "bg-purple-100 text-purple-700"
                                                                  : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-gray-600">
                                                {u.department?.name || (
                                                    <span className="text-gray-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                        u.is_approved
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"
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
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color, onClick }) {
    const colors = {
        indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
        violet: "bg-violet-50 border-violet-100 text-violet-700",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    };
    return (
        <div
            onClick={onClick}
            className={`rounded-xl border p-5 flex items-center gap-4 transition-all ${
                onClick
                    ? "cursor-pointer hover:shadow-md hover:scale-[1.02]"
                    : ""
            } ${colors[color]}`}
        >
            <span className="text-3xl">{icon}</span>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm font-medium opacity-80">{label}</p>
            </div>
        </div>
    );
}

export default Teacher;
