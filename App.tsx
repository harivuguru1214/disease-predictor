import React, { useState, useCallback } from 'react';
import { SYMPTOMS } from './constants';
import { analyzeSymptoms } from './services/geminiService';
import SymptomSelector from './components/SymptomSelector';
import AnalysisResult from './components/AnalysisResult';
import type { AnalysisResult as AnalysisResultType } from './services/geminiService';

const App: React.FC = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = useCallback(async () => {
        if (selectedSymptoms.length === 0) {
            setError("Please select at least one symptom to analyze.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzeSymptoms(selectedSymptoms);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedSymptoms]);

    return (
        <div className="min-h-screen font-sans text-slate-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-purple-800">
                        Disease Predictor
                    </h1>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6 h-fit">
                        <div>
                            <label className="block text-lg font-medium mb-2 text-slate-700">
                                1. Select Symptoms
                            </label>
                            <SymptomSelector
                                allSymptoms={SYMPTOMS}
                                selectedSymptoms={selectedSymptoms}
                                onChange={setSelectedSymptoms}
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || selectedSymptoms.length === 0}
                            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze Symptoms'
                            )}
                        </button>
                    </div>

                    <div className="mt-8 md:mt-0">
                         <h2 className="text-lg font-medium mb-2 text-slate-600">
                            2. View Analysis
                        </h2>
                        <AnalysisResult
                            isLoading={isLoading}
                            result={analysisResult}
                            error={error}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;