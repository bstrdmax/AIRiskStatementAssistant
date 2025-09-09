import type { FiveWhysAnalysis, GeneratedRiskData } from '../types';

async function callApi<T>(action: string, payload: object): Promise<T> {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, ...payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred.' }));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}


export const performFiveWhys = async (concern: string): Promise<FiveWhysAnalysis> => {
  return callApi<FiveWhysAnalysis>('fiveWhys', { concern });
};

export const generateRiskDetails = async (rootCause: string, originalConcern: string): Promise<GeneratedRiskData> => {
  return callApi<GeneratedRiskData>('generateDetails', { rootCause, originalConcern });
};
