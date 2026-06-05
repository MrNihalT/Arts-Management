import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    FetchProgramResults,
    selectProgramResults,
    selectResultsLoading,
    selectTop3,
} from "../features/results/resultSlice";

import bg from "../assets/images/trophy_bg.png";

export default function ResultDetails() {
    const { id } = useParams();

    const dispatch = useDispatch();

    const top3 = useSelector(selectTop3);
    const results = useSelector(selectProgramResults);
    const loading = useSelector(selectResultsLoading);

    useEffect(() => {
        dispatch(FetchProgramResults(id));
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0B13] flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0B13] text-white">
            {/* Hero */}
            <section
                className="relative bg-cover bg-center py-20 px-6 lg:px-12"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="absolute inset-0 bg-black/70"></div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Link to="/" className="hover:text-white">
                            Home
                        </Link>

                        <span>&gt;</span>

                        <Link to="/results" className="hover:text-white">
                            Results
                        </Link>

                        <span>&gt;</span>

                        <span className="text-white">
                            {results[0]?.program_name}
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase">
                        {results[0]?.program_name}
                    </h1>
                </div>
            </section>

            {/* Top 3 */}
            <section className="px-6 lg:px-12 py-12">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8">Top 3 Winners</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {top3.map((winner, index) => (
                            <div
                                key={index}
                                className="bg-[#15151E] border border-white/5 rounded-2xl p-8 text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                    {index + 1}
                                </div>

                                <h3 className="text-xl font-bold">
                                    {winner.user_name}
                                </h3>

                                <p className="text-gray-400 mt-2">
                                    {winner.program_name}
                                </p>

                                <div className="mt-4 inline-block bg-green-500/10 text-green-400 px-4 py-2 rounded-lg">
                                    {winner.obtained_score} Points
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Full Results */}
            <section className="px-6 lg:px-12 pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#15151E] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-2xl font-bold">Full Results</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm text-gray-400">
                                            Rank
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm text-gray-400">
                                            Participant
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm text-gray-400">
                                            Score
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {results.map((result, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-white/5 hover:bg-white/5"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                                                    {index + 1}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 font-medium">
                                                {result.user_name}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg">
                                                    {result.obtained_score}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {results.length === 0 && (
                                <div className="text-center py-10 text-gray-400">
                                    No results found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
