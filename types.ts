
export interface FiveWhysAnalysis {
  whys: { why: string; answer: string }[];
  rootCause: string;
}

export interface GeneratedRiskData {
  description: string;
  objective: string;
  statements: string[];
}

export enum AppStep {
  Input = 'INPUT',
  Analyzing = 'ANALYZING',
  AnalysisComplete = 'ANALYSIS_COMPLETE',
  Generating = 'GENERATING',
  StatementsComplete = 'STATEMENTS_COMPLETE',
  Error = 'ERROR',
}