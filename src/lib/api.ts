const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    throw new Error(`(${res.status}) ${await res.text()}`);
  }
  return res.json();
}

const api = {
  accommodations: () => request<any[]>('/accommodations'),
  peopleAccommodations: () => request<any[]>('/people/accommodations'),
  psychologicalPlatform: () => request<any[]>('/platforms/psychological'),
  medicalPlatform: () => request<any[]>('/platforms/medical'),
  supplies: () => request<any[]>('/hospital/supplies'),
  communitySupplies: () => request<any[]>('/community/supplies'),
  wikiStream: () => request<any[]>('/wiki/stream'),
  turnstileSiteKey: () => request<{ siteKey: string }>('/turnstile/sitekey'),
  reportIncorrect: (data: { type: string; cause: string; content: string; turnstileToken: string }) =>
    request<any>('/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  submitSupplies: (data: any) =>
    request<any>('/hospital/supplies/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  submitCommunitySupplies: (data: any) =>
    request<any>('/community/supplies/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};

export default api;
