
import React, { useState } from 'react';
import type { GeneratedRiskData } from '../types';
import { ClipboardIcon, CheckIcon, DocumentIcon, TargetIcon } from './IconComponents';

interface RiskDetailsDisplayProps {
  details: GeneratedRiskData;
}

const RiskStatementCard: React.FC<{ statement: string }> = ({ statement }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(statement).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [cause, effect] = statement.split(', then ');

  return (
    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 relative transition-all duration-300 hover:border-purple-400 hover:shadow-md hover:shadow-purple-500/10">
      <p className="text-slate-600">
        <span className="font-bold text-purple-600">{cause},</span>
        <span className="text-slate-800"> then {effect}</span>
      </p>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-800 transition-colors"
        aria-label="Copy statement"
      >
        {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <ClipboardIcon className="h-5 w-5" />}
      </button>
    </div>
  );
};


const RiskStatementsDisplay: React.FC<RiskDetailsDisplayProps> = ({ details }) => {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-lg animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Generated Risk Profile</h2>
        <p className="text-slate-600">Here is the risk profile the AI created. You can copy the information you need for your reports or records.</p>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <h3 className="flex items-center text-xl font-bold text-slate-800">
          <DocumentIcon className="h-6 w-6 mr-3 text-purple-500" />
          Risk Description
        </h3>
        <p className="mt-2 text-slate-700 leading-relaxed">
          {details.description}
        </p>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <h3 className="flex items-center text-xl font-bold text-slate-800">
          <TargetIcon className="h-6 w-6 mr-3 text-purple-500" />
          Risk Objective
        </h3>
        <p className="mt-2 text-slate-700 leading-relaxed">
          {details.objective}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">If/Then Statements</h3>
        <div className="space-y-4">
          {details.statements.map((stmt, index) => (
            <RiskStatementCard key={index} statement={stmt} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskStatementsDisplay;