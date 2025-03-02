'use client';

import { useState } from 'react';
import { mlService } from '../services/mlService';

export default function MLModelInterface() {
    const [country, setCountry] = useState('');
    const [prediction, setPrediction] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await mlService.predict({
                Entity: country
            });

            if (result.success && result.prediction !== undefined) {
                setPrediction(result.prediction);
            } else {
                setError(result.error || 'Unable to get prediction');
            }
        } catch (err) {
            setError('Failed to get prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Vitamin A Deficiency Assessment
                </h2>
                <p className="text-gray-600 mb-4">
                    Enter your country to check the vitamin A deficiency prevalence in your region.
                    This can help you understand potential risks and make informed health decisions.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                    </label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Afghanistan"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
                >
                    {loading ? 'Checking...' : 'Check Prevalence'}
                </button>
            </form>

            {prediction !== null && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                        Assessment Results
                    </h3>
                    <p className="text-gray-700">
                        In {country}, the prevalence of vitamin A deficiency is approximately{' '}
                        <span className="font-bold text-blue-800">{prediction.toFixed(1)}%</span> of the population.
                    </p>
                    <div className="mt-4 text-sm text-gray-600">
                        <p>What this means:</p>
                        <ul className="list-disc ml-5 mt-2">
                            <li>This percentage represents the proportion of people affected in your region</li>
                            <li>Consider consulting with a healthcare provider about vitamin A intake</li>
                            <li>Maintain a balanced diet rich in vitamin A sources</li>
                        </ul>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}
        </div>
    );
} 