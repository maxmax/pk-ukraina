export interface ApiResponse {
  message: string;
}

const APP_API_SOURCE: string = import.meta.env.VITE_APP_API_SOURCE || '/';

export const performRequest = async <T>(url: string, method: string, data?: unknown): Promise<T> => {
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
    const result: T = await response.json(); // Уточнение типа результата

    if (!response.ok) {
      throw new Error((result as ApiResponse)?.message || 'Помилка запиту');
    }

    return result;
  } catch (error) {
    console.error('Помилка:', error);
    throw error;
  }
};
