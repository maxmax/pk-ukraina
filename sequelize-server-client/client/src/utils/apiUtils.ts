export interface ApiResponse {
  message: string;
}

const APP_API_SOURCE = import.meta.env.VITE_APP_API_SOURCE || '/';

// Універсальна функція для виконання запитів
export const performRequest = async <T>(url: string, method: string, data?: any): Promise<T> => {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(`${APP_API_SOURCE}/${url}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Помилка запиту');
    }

    return result;
  } catch (error) {
    console.error('Помилка:', error);
    throw error;
  }
};
