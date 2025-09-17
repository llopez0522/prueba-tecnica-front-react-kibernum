// Configuración base para las peticiones HTTP
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

console.log('API_BASE_URL configurada:', API_BASE_URL);

// Función helper para manejar respuestas HTTP
const handleResponse = async <T>(response: Response): Promise<T> => {
  console.log(
    'handleResponse: Status:',
    response.status,
    'StatusText:',
    response.statusText
  );

  const data = await response.json();
  console.log('handleResponse: JSON data:', data);

  if (!response.ok) {
    // Si hay error, la respuesta viene con estructura {error, message, timestamp, path}
    const errorMessage =
      data.message || data.error || `HTTP error! status: ${response.status}`;
    console.error('handleResponse: Error del servidor:', data);
    throw new Error(errorMessage);
  }

  return data;
};

// Cliente HTTP base
export const httpClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('httpClient.get: Haciendo petición GET a:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleResponse<T>(response);
    } catch (error) {
      console.error('httpClient.get: Error en fetch:', error);
      throw error;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(
      'httpClient.post: Haciendo petición POST a:',
      url,
      'con datos:',
      data
    );

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await handleResponse<T>(response);
    } catch (error) {
      console.error('httpClient.post: Error en fetch:', error);
      throw error;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(
      'httpClient.put: Haciendo petición PUT a:',
      url,
      'con datos:',
      data
    );

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await handleResponse<T>(response);
    } catch (error) {
      console.error('httpClient.put: Error en fetch:', error);
      throw error;
    }
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('httpClient.delete: Haciendo petición DELETE a:', url);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleResponse<T>(response);
    } catch (error) {
      console.error('httpClient.delete: Error en fetch:', error);
      throw error;
    }
  },
};
