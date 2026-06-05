import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    FetchScores,
    selectResultsLoading,
    selectScores,
} from "../features/results/resultSlice";

import bg from "../assets/images/trophy_bg.png";

export default function Results() {
    const dispatch = useDispatch();

    const scores = useSelector(selectScores);
    const loading = useSelector(selectResultsLoading);

    useEffect(() => {
        dispatch(FetchScores());
    }, [dispatch]);

    // Get unique programs (keyed by program_id, not score id)
    const uniquePrograms = [
        ...new Map(
            scores.map((score) => [
                score.program_name,
                {
                    program_id: score.program_id,
                    program_name: score.program_name,
                },
            ]),
        ).values(),
    ];

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

                        <span className="text-white">Results</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase">
                        Results
                    </h1>

                    <p className="mt-4 text-gray-300 max-w-2xl">
                        Explore all program-wise results.
                    </p>
                </div>
            </section>

            {/* Programs */}
            <section className="px-6 lg:px-12 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {uniquePrograms.map((program) => (
                            <Link
                                key={program.program_id}
                                to={`/results/${program.program_id}`}
                                className="bg-[#15151E] border border-white/5 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-[#1A1A24] transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {program.program_name}
                                        </h2>

                                        <p className="text-gray-400 mt-2 text-sm">
                                            View full results
                                        </p>
                                    </div>

                                    <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                                        →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {uniquePrograms.length === 0 && (
                        <div className="text-center text-gray-400 py-20">
                            No programs available
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
