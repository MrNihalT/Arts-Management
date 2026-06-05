import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function JudgeDashboard() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [fests, setFests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFest, setSelectedFest] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [publishingId, setPublishingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [programsRes, festsRes] = await Promise.all([
          api.get("/programs/"),
          api.get("/programs/fests/"),
        ]);
        setPrograms(programsRes.data || []);
        setFests(festsRes.data || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePublishResult = async (programId) => {
    if (!window.confirm("Are you sure you want to calculate and publish results for this program? This will update the standings table.")) {
      return;
    }
    try {
      setPublishingId(programId);
      await api.post(`/results/publish/${programId}/`);
      toast.success("Results calculated and published successfully!");
      setPrograms((prev) =>
        prev.map((prog) =>
          prog.id === programId ? { ...prog, is_published: true } : prog
        )
      );
    } catch (err) {
      console.error("Failed to publish result:", err);
      toast.error(
        err.response?.data?.message || "Failed to publish result. Ensure scores are uploaded."
      );
    } finally {
      setPublishingId(null);
    }
  };

  // Filter programs based on selected fest and search query
  const filteredPrograms = programs.filter((prog) => {
    const matchesFest = selectedFest === "all" || String(prog.arts_fest) === String(selectedFest);
    const matchesSearch =
      prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prog.venue && prog.venue.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFest && matchesSearch;
  });

  // Calculate stats
  const totalPrograms = filteredPrograms.length;
  const publishedCount = filteredPrograms.filter((p) => p.is_published).length;
  const pendingCount = totalPrograms - publishedCount;

  return (
    <div className="min-h-screen bg-[#0B0B13] text-white relative overflow-hidden pb-16">
      {/* Ambient backgrounds */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 tracking-wider uppercase">
              Judge Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1 uppercase font-bold tracking-wider">
              Logged in as {user?.first_name || user?.username} ({user?.role})
            </p>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/announcement"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold rounded-full hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all tracking-wider uppercase no-underline"
            >
              📢 Create Announcement
            </Link>
            <Link
              to="/admin/announcement"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all tracking-wider uppercase no-underline"
            >
              📅 Schedule Program
            </Link>
            <Link
              to="/points_table"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#15151E] border border-white/10 hover:border-white/30 text-white text-xs font-bold rounded-full transition-all tracking-wider uppercase no-underline"
            >
              📊 Point Table
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total */}
          <div className="bg-[#15151E]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center text-3xl text-indigo-400 border border-indigo-500/20">
              🎭
            </div>
            <div>
              <p className="text-3xl font-black tracking-wider text-white">
                {totalPrograms}
              </p>
              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mt-1">
                Total Programs
              </p>
            </div>
          </div>

          {/* Published */}
          <div className="bg-[#15151E]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center text-3xl text-green-400 border border-green-500/20">
              ✅
            </div>
            <div>
              <p className="text-3xl font-black tracking-wider text-green-400">
                {publishedCount}
              </p>
              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mt-1">
                Results Published
              </p>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-[#15151E]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center text-3xl text-orange-400 border border-orange-500/20">
              ⏳
            </div>
            <div>
              <p className="text-3xl font-black tracking-wider text-orange-400">
                {pendingCount}
              </p>
              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mt-1">
                Draft / Pending Results
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#15151E] rounded-2xl border border-white/5 p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Search Programs
            </label>
            <input
              type="text"
              placeholder="Search by name or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-[#0B0B13] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Filter by Arts Fest
            </label>
            <select
              value={selectedFest}
              onChange={(e) => setSelectedFest(e.target.value)}
              className="w-full px-4 py-3 bg-[#0B0B13] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="all">All Fests</option>
              {fests.map((fest) => (
                <option key={fest.id} value={fest.id}>
                  {fest.name} ({fest.year})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Programs Listing */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="bg-[#15151E] rounded-2xl border border-white/5 py-16 text-center text-gray-500 italic shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            No programs found matching the filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-[#15151E] rounded-2xl border border-white/5 overflow-hidden hover:border-purple-500/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between"
              >
                {/* Card Header Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-xl font-bold tracking-wide text-white leading-snug">
                      {prog.name}
                    </h3>
                    <span
                      className={`text-[0.65rem] font-bold px-2.5 py-1.5 rounded-md tracking-wider uppercase border ${
                        prog.is_published
                          ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.15)]"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.15)]"
                      }`}
                    >
                      {prog.is_published ? "Published" : "Draft"}
                    </span>
                  </div>

                  {/* Program Metadata */}
                  <div className="space-y-2.5 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                      <span>🗓️</span>
                      <span>Fest: <strong className="text-gray-200">{prog.arts_fest_name || "N/A"}</strong></span>
                    </div>
                    {prog.venue && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>Venue: <strong className="text-gray-200">{prog.venue}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>Registrations: <strong className="text-gray-200">{prog.registration_count || 0}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🏷️</span>
                      <span>Format: <strong className="text-gray-200">{prog.is_team_based ? `Team (Max: ${prog.max_team_members})` : "Solo"}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="p-6 bg-white/5 border-t border-white/5 flex flex-wrap gap-2 items-center justify-between">
                  <Link
                    to={`/admin/scoreupload?program=${prog.id}`}
                    className="flex-1 min-w-[100px] text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors no-underline uppercase tracking-wider"
                  >
                    📝 Scores
                  </Link>

                  {prog.is_published ? (
                    <Link
                      to={`/results/${prog.id}`}
                      className="flex-1 min-w-[100px] text-center px-4 py-2 bg-green-600/10 border border-green-500/30 hover:bg-green-600 text-green-400 hover:text-white text-xs font-bold rounded-lg transition-all no-underline uppercase tracking-wider"
                    >
                      👁️ View Result
                    </Link>
                  ) : (
                    <button
                      onClick={() => handlePublishResult(prog.id)}
                      disabled={publishingId === prog.id}
                      className="flex-1 min-w-[100px] px-4 py-2 bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-500 hover:to-orange-400 text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {publishingId === prog.id ? "Publishing..." : "📢 Publish"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
