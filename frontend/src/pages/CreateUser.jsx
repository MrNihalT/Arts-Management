import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    createUserAPI,
    getDepartmentsAPI,
    getAcademicYearsAPI,
} from "../features/auth/authAPI";

const ROLES = [
    { value: "admin", label: "Admin" },
    { value: "principal", label: "Principal" },
    { value: "teacher", label: "Teacher" },
    { value: "judge", label: "Judge" },
    { value: "student", label: "Student" },
];

const initialForm = {
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "",
    department: "",
    admission_year: "",
    expected_graduation_year: "",
    is_alumni: false,
    is_dropout: false,
};

export default function CreateUser() {
    const navigate = useNavigate();

    // Fetch departments directly from backend
    const [departments, setDepartments] = useState([]);
    const [deptLoading, setDeptLoading] = useState(true);
    const [deptError, setDeptError] = useState(null);
    const [confirm_password, setConfirmPassword] = useState("");
    const [academicYears, setAcademicYears] = useState([]);
    useEffect(() => {
        getDepartmentsAPI()
            .then((data) => setDepartments(data))
            .catch(() => setDeptError("Failed to load departments."))
            .finally(() => setDeptLoading(false));

        getAcademicYearsAPI()
            .then((data) => setAcademicYears(data))
            .catch(console.error);
    }, []);

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // object or string
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (form.password !== confirm_password) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        const payload = { ...form };
        if (!payload.department) delete payload.department;
        if (!payload.admission_year) delete payload.admission_year;
        if (!payload.expected_graduation_year)
            delete payload.expected_graduation_year;

        try {
            await createUserAPI(payload);
            setSuccess(true);
            setForm(initialForm);
        } catch (err) {
            setError(err.response?.data || { error: "Something went wrong." });
        } finally {
            setLoading(false);
        }
    };

    // Flatten backend validation errors into a readable list
    const errorMessages = error
        ? typeof error === "string"
            ? [error]
            : Object.entries(error).map(
                  ([field, msgs]) =>
                      `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`,
              )
        : [];

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-indigo-50 flex items-start justify-center px-4 py-10">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/admin")}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4 transition-colors"
                    >
                        ← Back to Admin Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Create New User
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Fill in the details below. All users created here are
                        automatically approved.
                    </p>
                </div>

                {/* Success banner */}
                {success && (
                    <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4 text-sm font-medium">
                        <span className="text-xl">✅</span>
                        User created successfully!
                    </div>
                )}

                {/* Error banner */}
                {errorMessages.length > 0 && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
                        <p className="text-red-700 text-sm font-semibold mb-1">
                            Please fix the following errors:
                        </p>
                        <ul className="list-disc list-inside space-y-0.5">
                            {errorMessages.map((msg, i) => (
                                <li key={i} className="text-red-600 text-sm">
                                    {msg}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Row: first + last name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field
                                label="First Name"
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                                placeholder="John"
                            />
                            <Field
                                label="Last Name"
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
                                placeholder="Doe"
                            />
                        </div>

                        {/* Username */}
                        <Field
                            label="Username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="john_doe"
                            required
                        />

                        {/* Email */}
                        <Field
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                        />

                        {/* Password */}
                        <Field
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min 8 characters"
                            required
                        />

                        {/* Confirm Password */}
                        <Field
                            label="Confirm Password"
                            name="confirm_password"
                            type="password"
                            value={confirm_password}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            required
                        />

                        {/* Phone */}
                        <Field
                            label="Phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="9876543210"
                        />

                        {/* Row: role + department */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Role dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                >
                                    <option value="">Select role…</option>
                                    {ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Department dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Department{" "}
                                    <span className="text-gray-400 font-normal">
                                        (optional)
                                    </span>
                                </label>
                                {deptError ? (
                                    <p className="text-red-500 text-sm">
                                        {deptError}
                                    </p>
                                ) : (
                                    <select
                                        name="department"
                                        value={form.department}
                                        onChange={handleChange}
                                        disabled={deptLoading}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-60"
                                    >
                                        <option value="">
                                            {deptLoading ? "Loading…" : "None"}
                                        </option>
                                        {departments.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Admission Year{" "}
                                    <span className="text-gray-400 font-normal">
                                        (optional)
                                    </span>
                                </label>
                                <select
                                    name="admission_year"
                                    value={form.admission_year}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                >
                                    <option value="">
                                        Select admission year…
                                    </option>
                                    {academicYears.map((year) => (
                                        <option key={year.id} value={year.id}>
                                            {year.name} ({year.year})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Field
                                label="Expected Graduation"
                                name="expected_graduation_year"
                                type="number"
                                value={form.expected_graduation_year}
                                onChange={handleChange}
                                placeholder="YYYY (e.g. 2027)"
                            />
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-4 border border-gray-200 rounded-xl">
                            <input
                                type="checkbox"
                                id="is_alumni"
                                name="is_alumni"
                                checked={form.is_alumni}
                                onChange={handleChange}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex flex-col">
                                <label
                                    htmlFor="is_alumni"
                                    className="text-sm font-semibold text-gray-900 cursor-pointer"
                                >
                                    Mark as Alumni / Graduated
                                </label>
                                <span className="text-xs text-gray-500">
                                    Checking this drops the user from current
                                    events and fests.
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-4 border border-gray-200 rounded-xl">
                            <input
                                type="checkbox"
                                id="is_dropout"
                                name="is_dropout"
                                checked={form.is_dropout}
                                onChange={handleChange}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex flex-col">
                                <label
                                    htmlFor="is_dropout"
                                    className="text-sm font-semibold text-gray-900 cursor-pointer"
                                >
                                    Mark as Dropout
                                </label>
                                <span className="text-xs text-gray-500">
                                    Dropout students cannot participate in
                                    current events.
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/admin")}
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold transition-colors flex items-center gap-2"
                            >
                                {loading ? (
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
                                    "Create User"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Reusable input field component
function Field({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required,
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
        </div>
    );
}
