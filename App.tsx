
import React, { useState, useCallback } from 'react';
import { AppStep, FiveWhysAnalysis, GeneratedRiskData } from './types';
import { performFiveWhys, generateRiskDetails } from './services/geminiService';
import Header from './components/Header';
import RiskInput from './components/RiskInput';
import FiveWhysDisplay from './components/FiveWhysDisplay';
import RiskStatementsDisplay from './components/RiskStatementsDisplay';
import { BrainCircuitIcon, RestartIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Input);
  const [riskConcern, setRiskConcern] = useState<string>('');
  const [fiveWhysResult, setFiveWhysResult] = useState<FiveWhysAnalysis | null>(null);
  const [generatedRiskData, setGeneratedRiskData] = useState<GeneratedRiskData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setStep(AppStep.Input);
    setRiskConcern('');
    setFiveWhysResult(null);
    setGeneratedRiskData(null);
    setError(null);
  };

  const handleAnalyze = async (concern: string) => {
    setRiskConcern(concern);
    setStep(AppStep.Analyzing);
    setError(null);
    try {
      const result = await performFiveWhys(concern);
      setFiveWhysResult(result);
      setStep(AppStep.AnalysisComplete);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
      setStep(AppStep.Error);
    }
  };

  const handleGenerateDetails = useCallback(async () => {
    if (!fiveWhysResult || !riskConcern) return;
    
    setStep(AppStep.Generating);
    setError(null);
    try {
      const details = await generateRiskDetails(fiveWhysResult.rootCause, riskConcern);
      setGeneratedRiskData(details);
      setStep(AppStep.StatementsComplete);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating statements.');
      setStep(AppStep.Error);
    }
  }, [fiveWhysResult, riskConcern]);

  const renderContent = () => {
    switch (step) {
      case AppStep.Input:
        return <RiskInput onAnalyze={handleAnalyze} isLoading={false} />;
      case AppStep.Analyzing:
      case AppStep.Generating:
        return (
           <div className="w-full text-center p-8 bg-white/50 rounded-lg shadow-sm border border-slate-200">
             <div className="flex items-center justify-center text-purple-500">
               <BrainCircuitIcon className="h-10 w-10 animate-pulse mr-4" />
               <p className="text-xl text-purple-800 font-medium">
                 {step === AppStep.Analyzing ? 'Finding the Root Cause...' : 'Creating the Risk Profile...'}
               </p>
             </div>
             <p className="text-slate-500 mt-4">The AI is thinking. This may take a moment.</p>
           </div>
        );
      case AppStep.AnalysisComplete:
        return fiveWhysResult && <FiveWhysDisplay analysis={fiveWhysResult} onGenerate={handleGenerateDetails} />;
      case AppStep.StatementsComplete:
        return generatedRiskData && <RiskStatementsDisplay details={generatedRiskData} />;
      case AppStep.Error:
        return (
          <div className="w-full text-center p-8 bg-red-50 border border-red-300 rounded-lg">
            <h3 className="text-2xl font-bold text-red-600">Analysis Failed</h3>
            <p className="text-red-500 mt-2">{error}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          {renderContent()}
        </main>
        
        {step !== AppStep.Input && (
          <div className="mt-8 text-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-purple-600 transition-colors"
            >
              <RestartIcon className="h-5 w-5 mr-2" />
              Start Over
            </button>
          </div>
        )}
         <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Powered by AI. Always check the AI's work to make sure it's correct and makes sense for your situation.</p>
            <p className="mt-2 font-semibold text-slate-600">Powered by Maxwell Risk Group</p>
        </footer>
      </div>
    </div>
  );
};

export default App;