import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function AddScore() {
  const user = useSelector(selectUser);
  const [searchParams] = useSearchParams();
  const programQueryParam = searchParams.get("program");

  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [participants, setParticipants] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [scoreInputs, setScoreInputs] = useState({});
  const [editMode, setEditMode] = useState({}); // { [participation_id]: boolean }
  const [editInputs, setEditInputs] = useState({}); // { [score_id]: value }

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const res = await api.get("/programs/");
        setPrograms(res.data);
        if (programQueryParam) {
          setSelectedProgram(programQueryParam);
        }
      } catch (err) {
        console.error("Error fetching programs:", err);
        toast.error("Failed to load programs");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [programQueryParam]);

  useEffect(() => {
    if (programQueryParam) {
      setSelectedProgram(programQueryParam);
    }
  }, [programQueryParam]);

  useEffect(() => {
    if (!selectedProgram) {
      setParticipants([]);
      setScores([]);
      return;
    }

    const fetchDetails = async () => {
      try {
        setFetchingData(true);
        const [partRes, scoreRes] = await Promise.all([
          api.get(`/participations/program/${selectedProgram}/`),
          api.get(`/scores/?program=${selectedProgram}`),
        ]);
        console.log("Participations:", partRes.data);
        console.log("Scores:", scoreRes.data);

        // DRF might return paginated results like { count: X, results: [...] }
        const participantsData = Array.isArray(partRes.data)
          ? partRes.data
          : partRes.data.results || [];
        const scoresData = Array.isArray(scoreRes.data)
          ? scoreRes.data
          : scoreRes.data.results || [];

        setParticipants(participantsData);
        setScores(scoresData);
      } catch (err) {
        console.error("Error fetching details:", err);
        toast.error("Failed to fetch participant details");
      } finally {
        setFetchingData(false);
      }
    };
    fetchDetails();
  }, [selectedProgram]);

  const handleScoreChange = (participationId, val) => {
    setScoreInputs((prev) => ({ ...prev, [participationId]: val }));
  };

  const handleEditChange = (scoreId, val) => {
    setEditInputs((prev) => ({ ...prev, [scoreId]: val }));
  };

  const handleAddScore = async (participationId) => {
    const scoreVal = scoreInputs[participationId];
    if (scoreVal === undefined || scoreVal === "") {
      toast.error("Please enter a score");
      return;
    }
    try {
      const res = await api.post("/scores/", {
        participation: participationId,
        obtained_score: Number(scoreVal),
      });
      toast.success("Score added successfully!");
      setScores((prev) => [...prev, res.data]);
      setScoreInputs((prev) => ({ ...prev, [participationId]: "" }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to add score");
    }
  };

  const handleUpdateScore = async (scoreId, participationId) => {
    const scoreVal = editInputs[scoreId];
    if (scoreVal === undefined || scoreVal === "") {
      toast.error("Please enter a score");
      return;
    }
    try {
      const res = await api.patch(`/scores/${scoreId}/`, {
        obtained_score: Number(scoreVal),
      });
      toast.success("Score updated successfully!");
      setScores((prev) => prev.map((s) => (s.id === scoreId ? res.data : s)));
      setEditMode((prev) => ({ ...prev, [participationId]: false }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update score");
    }
  };
  const handlePublishResult = async () => {
    if (!selectedProgram) return;
    if (!window.confirm("Are you sure you want to calculate and publish results for this program? This will update the standings table.")) {
      return;
    }
    try {
      setPublishing(true);
      await api.post(`/results/publish/${selectedProgram}/`);
      toast.success("Results calculated and published successfully!");
      setPrograms((prev) =>
        prev.map((prog) =>
          String(prog.id) === String(selectedProgram) ? { ...prog, is_published: true } : prog
        )
      );
    } catch (err) {
      console.error("Failed to publish result:", err);
      toast.error(
        err.response?.data?.message || "Failed to publish result. Ensure scores are uploaded."
      );
    } finally {
      setPublishing(false);
    }
  };

  const participantsWithScores = participants.map((p) => {
    const existingScore = scores.find((s) => s.participation_id === p.id);
    return { ...p, score: existingScore };
  });

  const uploaded = participantsWithScores.filter((p) => p.score);
  const unuploaded = participantsWithScores.filter((p) => !p.score);

  return (
    <div className="min-h-screen bg-[#0B0B13] text-white p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
              Manage Scores
            </h1>
            <p className="text-gray-400">
              Select a program to view participants and upload scores.
            </p>
          </div>
          {selectedProgram && (
            <div className="flex items-center gap-3">
              {programs.find((p) => String(p.id) === String(selectedProgram))?.is_published ? (
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-xl text-sm font-bold tracking-wider uppercase">
                  ✅ Results Published
                </span>
              ) : (
                <button
                  onClick={handlePublishResult}
                  disabled={publishing}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-500 hover:to-orange-400 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                >
                  {publishing ? "Publishing..." : "📢 Publish Results"}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#15151E] p-6 rounded-2xl border border-white/5 mb-10">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Select Program
          </label>
          <select
            className="w-full lg:w-1/2 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Choose a Program --</option>
            {programs.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name} ({prog.arts_fest_name || "Fest"})
              </option>
            ))}
          </select>
        </div>

        {fetchingData ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : selectedProgram ? (
          <div className="space-y-12">
            {/* Unuploaded Students Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                Pending Uploads ({unuploaded.length})
              </h2>
              {unuploaded.length === 0 ? (
                <div className="text-gray-500 bg-[#15151E] p-6 rounded-2xl border border-white/5 text-center">
                  All students have been scored!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unuploaded.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#15151E] border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{p.user}</h3>
                          <p className="text-sm text-gray-400">
                            {p.department}
                          </p>
                          {p.team && (
                            <span className="inline-block mt-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md">
                              Team: {p.team}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                          placeholder="Score"
                          value={scoreInputs[p.id] || ""}
                          onChange={(e) =>
                            handleScoreChange(p.id, e.target.value)
                          }
                        />
                        <button
                          onClick={() => handleAddScore(p.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Uploaded Students Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Scored Students ({uploaded.length})
              </h2>
              {uploaded.length === 0 ? (
                <div className="text-gray-500 bg-[#15151E] p-6 rounded-2xl border border-white/5 text-center">
                  No scores uploaded yet.
                </div>
              ) : (
                <div className="bg-[#15151E] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5">
                          <th className="px-6 py-4 font-medium text-gray-400 border-b border-white/5">
                            Participant
                          </th>
                          <th className="px-6 py-4 font-medium text-gray-400 border-b border-white/5">
                            Department
                          </th>
                          <th className="px-6 py-4 font-medium text-gray-400 border-b border-white/5">
                            Score
                          </th>
                          <th className="px-6 py-4 font-medium text-gray-400 border-b border-white/5">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploaded.map((p) => {
                          const isEditing = editMode[p.id];
                          return (
                            <tr
                              key={p.id}
                              className="hover:bg-white/5 border-b border-white/5 last:border-0"
                            >
                              <td className="px-6 py-4">
                                <div className="font-semibold">{p.user}</div>
                                {p.team && (
                                  <div className="text-xs text-purple-400 mt-1">
                                    Team: {p.team}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-gray-400">
                                {p.department}
                              </td>
                              <td className="px-6 py-4">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    className="w-24 bg-black border border-white/10 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-purple-500"
                                    value={
                                      editInputs[p.score.id] !== undefined
                                        ? editInputs[p.score.id]
                                        : p.score.obtained_score
                                    }
                                    onChange={(e) =>
                                      handleEditChange(
                                        p.score.id,
                                        e.target.value,
                                      )
                                    }
                                  />
                                ) : (
                                  <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-lg font-medium">
                                    {p.score.obtained_score}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {isEditing ? (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleUpdateScore(p.score.id, p.id)
                                      }
                                      className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() =>
                                        setEditMode({
                                          ...editMode,
                                          [p.id]: false,
                                        })
                                      }
                                      className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setEditMode({
                                        ...editMode,
                                        [p.id]: true,
                                      });
                                      setEditInputs({
                                        ...editInputs,
                                        [p.score.id]: p.score.obtained_score,
                                      });
                                    }}
                                    className="text-sm bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white px-3 py-1 rounded-lg transition-all"
                                  >
                                    Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
