
import { Participant, Prize, Result } from '../types';

/**
 * Common logic to fetch from Apps Script
 */
async function fetchFromGAS(baseUrl: string, action: string, method: string = 'GET', body?: any) {
  const url = new URL(baseUrl);
  url.searchParams.set('action', action);
  
  const options: RequestInit = {
    method,
  };

  if (method === 'POST' && body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), options);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
}

export const fetchParticipants = async (baseUrl: string): Promise<Participant[]> => {
  return fetchFromGAS(baseUrl, 'getParticipants');
};

export const fetchPrizes = async (baseUrl: string): Promise<Prize[]> => {
  return fetchFromGAS(baseUrl, 'getPrizes');
};

export const fetchResults = async (baseUrl: string): Promise<Result[]> => {
  return fetchFromGAS(baseUrl, 'getResults');
};

export const saveResultToSheet = async (baseUrl: string, result: Omit<Result, 'time'> & { time: string }): Promise<any> => {
  return fetchFromGAS(baseUrl, 'saveResult', 'POST', result);
};
