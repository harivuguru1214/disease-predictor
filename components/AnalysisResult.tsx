import React from 'react';
import type { AnalysisResult as AnalysisResultType } from '../services/geminiService';

interface AnalysisResultProps {
    isLoading: boolean;
    result: AnalysisResultType | null;
    error: string | null;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ isLoading, result, error }) => {
    if (isLoading) {
        return (
             <div className="w-full bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-4 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-10 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4 mt-4"></div>
                <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                    <div className="h-6 w-32 bg-slate-200 rounded-full"></div>
                    <div className="h-6 w-28 bg-slate-200 rounded-full"></div>
                </div>
                 <div className="h-4 bg-slate-200 rounded w-1/4 mt-6"></div>
                 <div className="h-8 bg-slate-200 rounded w-full mt-2"></div>
                 <div className="h-8 bg-slate-200 rounded w-full mt-2"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p className="font-bold">Analysis Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="text-center text-slate-500 p-6 border-2 border-dashed border-slate-300 rounded-lg">
                    <p>Your analysis results will appear here.</p>
                </div>
            </div>
        );
    }

    const topPrediction = result[0];
    const otherPredictions = result.slice(1);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
            {topPrediction && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-3">
                        Top Match
                    </h3>
                    <div className="text-center bg-purple-50 p-6 rounded-lg">
                        <p className="text-sm uppercase tracking-wider text-purple-600 font-semibold">
                            {Math.round(topPrediction.likelihood * 100)}% Likelihood
                        </p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {topPrediction.disease}
                        </p>
                    </div>
                     <div className="mt-4">
                        <h4 className="font-semibold text-sm text-slate-600 mb-2">Key Contributing Symptoms:</h4>
                        <div className="flex flex-wrap gap-2">
                            {topPrediction.contributingSymptoms.map(symptom => (
                                <span key={symptom} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {symptom}
                                </span>
                            ))}
                        </div>
                    </div>
                    {topPrediction.foodDiet && topPrediction.foodDiet.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-sm text-slate-600 mb-2">Recommended Diet:</h4>
                            <div className="flex flex-wrap gap-2">
                                {topPrediction.foodDiet.map(item => (
                                    <span key={item} className="bg-fuchsia-100 text-fuchsia-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                     {topPrediction.prescription && topPrediction.prescription.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-sm text-slate-600 mb-2">Common Prescriptions:</h4>
                            <div className="flex flex-wrap gap-2">
                                {topPrediction.prescription.map(item => (
                                    <span key={item} className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {otherPredictions.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-3">
                        Other Possibilities
                    </h3>
                    <ul className="space-y-4">
                       {otherPredictions.map((pred, index) => (
                           <li key={index} className="grid grid-cols-5 gap-x-3 items-center text-sm">
                               <span className="col-span-2 font-medium text-slate-700 truncate" title={pred.disease}>
                                   {pred.disease}
                               </span>
                               <div className="col-span-3 flex items-center gap-2">
                                   <div className="w-full bg-slate-200 rounded-full h-2.5">
                                       <div 
                                            className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                                            style={{ width: `${pred.likelihood * 100}%` }}
                                            role="progressbar"
                                            aria-valuenow={Math.round(pred.likelihood * 100)}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label={`${pred.disease} likelihood`}
                                        ></div>
                                   </div>
                                   <span className="font-mono text-slate-500 w-10 text-right">{Math.round(pred.likelihood * 100)}%</span>
                               </div>
                           </li>
                       ))}
                    </ul>
                </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-xs text-center text-slate-500">
                    <strong>Disclaimer:</strong> This information is AI-generated and for informational purposes only. It is not a substitute for professional medical advice. Always consult a healthcare provider for any health concerns.
                </p>
            </div>
        </div>
    );
};

export default AnalysisResult;