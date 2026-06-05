import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import { changePasswordAPI } from "../features/auth/authAPI";

function Profile() {
    const user = useSelector(selectUser);

    // Password Change Modal State
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [pwdStatus, setPwdStatus] = useState({
        loading: false,
        error: null,
        success: false,
    });

    // Handle Password Submit
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPwdStatus({ loading: true, error: null, success: false });
        try {
            await changePasswordAPI({
                old_password: oldPassword,
                new_password: newPassword,
            });
            setPwdStatus({ loading: false, error: null, success: true });
            setOldPassword("");
            setNewPassword("");
            setTimeout(() => {
                setPasswordModalOpen(false);
                setPwdStatus({ loading: false, error: null, success: false });
            }, 2000);
        } catch (err) {
            setPwdStatus({
                loading: false,
                error:
                    err.response?.data?.error ||
                    err.response?.data?.old_password?.[0] ||
                    err.response?.data?.new_password?.[0] ||
                    "Failed to change password",
                success: false,
            });
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center flex-col items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-indigo-700 font-semibold">
                    Loading Profile...
                </p>
            </div>
        );
    }

    const {
        username,
        email,
        first_name,
        last_name,
        phone,
        department,
        role,
        is_approved,
        team,
        profile_photo,
    } = user;

    const initials =
        `${first_name?.[0] || ""}${last_name?.[0] || ""}`.toUpperCase() ||
        username[0].toUpperCase();
    const fullName =
        first_name || last_name
            ? `${first_name} ${last_name}`.trim()
            : username;

    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50">
                    <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 h-32 sm:h-48 relative">
                        <div className="absolute -bottom-12 sm:-bottom-16 left-6 sm:left-10">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                                {profile_photo ? (
                                    <img
                                        src={profile_photo}
                                        alt={username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-800">
                                        {initials}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 sm:pt-20 px-6 sm:px-10 pb-10">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            {/* Name and Username */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    {fullName}
                                </h1>
                                <p className="text-lg text-indigo-500 font-medium">
                                    @{username}
                                </p>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm">
                                    {role.replace("_", " ")}
                                </span>
                                {is_approved ? (
                                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1">
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Approved
                                    </span>
                                ) : (
                                    <span className="px-4 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1">
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v3a1 1 0 01-2 0V9zm1-5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Pending
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setPasswordModalOpen(true)}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors border border-indigo-200 shadow-sm"
                            >
                                Change Password
                            </button>
                        </div>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact Info Card */}
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900/60 uppercase tracking-widest mb-5 border-b border-gray-200 pb-3 flex items-center gap-2">
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
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Contact Info
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold tracking-wide">
                                            EMAIL ADDRESS
                                        </p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {email || (
                                                <span className="text-gray-400 italic">
                                                    Not provided
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold tracking-wide">
                                            PHONE NUMBER
                                        </p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {phone || (
                                                <span className="text-gray-400 italic">
                                                    Not provided
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Info Card */}
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900/60 uppercase tracking-widest mb-5 border-b border-gray-200 pb-3 flex items-center gap-2">
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
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                    Academic Info
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold tracking-wide">
                                            DEPARTMENT
                                        </p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {department?.name || department || (
                                                <span className="text-gray-400 italic">
                                                    Not assigned
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold tracking-wide">
                                            TEAM
                                        </p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {team?.name || team || (
                                                <span className="text-gray-400 italic">
                                                    Not assigned
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Change Password
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Enter your old password and a new one to update
                                your credentials.
                            </p>

                            {pwdStatus.success ? (
                                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 mb-6 border border-green-200">
                                    <svg
                                        className="w-6 h-6 shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">
                                            Success!
                                        </p>
                                        <p className="text-sm">
                                            Password updated successfully.
                                            Closing...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handlePasswordSubmit}
                                    className="space-y-4"
                                >
                                    {pwdStatus.error && (
                                        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm mb-4">
                                            {pwdStatus.error}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Old Password
                                        </label>
                                        <input
                                            type="password"
                                            value={oldPassword}
                                            onChange={(e) =>
                                                setOldPassword(e.target.value)
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                            required
                                            minLength="8"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPasswordModalOpen(false);
                                                setPwdStatus({
                                                    error: null,
                                                    loading: false,
                                                    success: false,
                                                });
                                                setOldPassword("");
                                                setNewPassword("");
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={
                                                pwdStatus.loading ||
                                                !oldPassword ||
                                                !newPassword
                                            }
                                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center min-w-[120px]"
                                        >
                                            {pwdStatus.loading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                "Update"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Profile;
