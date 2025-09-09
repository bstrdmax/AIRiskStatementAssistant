import React, { useState } from 'react';
import { AnalyzeIcon } from './IconComponents';

interface RiskInputProps {
  onAnalyze: (concern: string) => void;
  isLoading: boolean;
}

const RiskInput: React.FC<RiskInputProps> = ({ onAnalyze, isLoading }) => {
  const [concern, setConcern] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (concern.trim()) {
      onAnalyze(concern.trim());
    }
  };

  return (
    <div className="w-full p-6 bg-white border border-slate-200 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit}>
        <label htmlFor="risk-concern" className="block text-lg font-medium text-slate-800">
          What are you concerned about?
        </label>
        <p className="text-sm text-slate-500 mt-1 mb-3">Tell us about a problem or something you're worried about. For example, "Customer reports often have mistakes."</p>
        <textarea
          id="risk-concern"
          rows={4}
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          placeholder="Type your concern here..."
          className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-slate-900 placeholder-slate-400"
          disabled={isLoading}
        />
        <div className="mt-4 text-right">
          <button
            type="submit"
            disabled={isLoading || !concern.trim()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-purple-500 transition-colors"
          >
            <AnalyzeIcon className="h-5 w-5 mr-2" />
            {isLoading ? 'Analyzing...' : 'Find Root Cause'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RiskInput;