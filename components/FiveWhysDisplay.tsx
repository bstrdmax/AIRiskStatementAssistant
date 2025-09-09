import React from 'react';
import type { FiveWhysAnalysis } from '../types';
import { GenerateIcon, LightbulbIcon } from './IconComponents';

interface FiveWhysDisplayProps {
  analysis: FiveWhysAnalysis;
  onGenerate: () => void;
}

const FiveWhysDisplay: React.FC<FiveWhysDisplayProps> = ({ analysis, onGenerate }) => {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">5 Whys Analysis</h2>
      <div className="space-y-4">
        {analysis.whys.map((item, index) => (
          <div key={index} className="p-4 bg-purple-50/60 rounded-lg border-l-4 border-purple-300">
            <p className="font-semibold text-slate-700">
              <span className="font-bold text-purple-600">Why {index + 1}:</span> {item.why}
            </p>
            <p className="mt-1 text-slate-600 pl-2 border-l-2 border-slate-200 ml-2">
              <span className="font-semibold text-slate-800">Answer:</span> {item.answer}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-purple-100 border border-purple-200 rounded-lg">
        <h3 className="flex items-center text-xl font-bold text-purple-800">
          <LightbulbIcon className="h-6 w-6 mr-2" />
          The Real Problem (Root Cause)
        </h3>
        <p className="mt-2 text-purple-900 text-lg">
          {analysis.rootCause}
        </p>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onGenerate}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-purple-500 transition-colors"
        >
          <GenerateIcon className="h-5 w-5 mr-2" />
          Create Full Risk Profile
        </button>
      </div>
    </div>
  );
};

export default FiveWhysDisplay;