import React, { useState, useEffect, useRef, useMemo } from 'react';

interface SymptomSelectorProps {
    allSymptoms: string[];
    selectedSymptoms: string[];
    onChange: (symptoms: string[]) => void;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({ allSymptoms, selectedSymptoms, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredSymptoms = useMemo(() => 
        allSymptoms.filter(symptom =>
            symptom.toLowerCase().includes(searchTerm.toLowerCase())
        ), [allSymptoms, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleSymptom = (symptom: string) => {
        const newSelection = selectedSymptoms.includes(symptom)
            ? selectedSymptoms.filter(s => s !== symptom)
            : [...selectedSymptoms, symptom];
        onChange(newSelection);
    };

    const clearSelection = () => {
        onChange([]);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div 
                className="w-full flex items-center justify-between bg-white border border-slate-300 rounded-lg p-2 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-wrap gap-1">
                    {selectedSymptoms.length > 0 ? (
                        selectedSymptoms.slice(0, 5).map(symptom => (
                            <span key={symptom} className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {symptom}
                            </span>
                        ))
                    ) : (
                        <span className="text-slate-400 px-2">Select symptoms...</span>
                    )}
                    {selectedSymptoms.length > 5 && (
                         <span className="bg-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            +{selectedSymptoms.length - 5} more
                        </span>
                    )}
                </div>
                <div className="flex items-center">
                    {selectedSymptoms.length > 0 && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); clearSelection(); }} 
                            className="text-slate-400 hover:text-slate-600 mr-2 p-1"
                            aria-label="Clear selection"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                     <svg className={`w-5 h-5 text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-xl">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Search symptoms..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredSymptoms.map(symptom => (
                            <li
                                key={symptom}
                                className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center"
                                onClick={() => toggleSymptom(symptom)}
                            >
                                <input
                                    type="checkbox"
                                    readOnly
                                    checked={selectedSymptoms.includes(symptom)}
                                    className="mr-3 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="flex-1">{symptom}</span>
                            </li>
                        ))}
                         {filteredSymptoms.length === 0 && (
                            <li className="px-4 py-2 text-slate-500">No symptoms found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SymptomSelector;