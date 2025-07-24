export interface BaseApiOptions {
  headers?: Record<string, string>;
  timeout?: number;
  authToken?: string;
}

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export class BaseApi {
  protected baseURL: string;
  protected defaultHeaders: Record<string, string>;
  protected timeout: number;

  constructor(baseURL: string, options: BaseApiOptions = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      ...(options.authToken
        ? { Authorization: `Bearer ${options.authToken}` }
        : {}),
      ...options.headers,
    };
    this.timeout = options.timeout || 10000;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  private async handleResponse<T = unknown>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {}

      switch (response.status) {
        case 404:
          throw new Error(`Resource not found: ${errorMessage}`);
        case 401:
          throw new Error(`Unauthorized: ${errorMessage}`);
        case 403:
          throw new Error(`Forbidden: ${errorMessage}`);
        case 429:
          throw new Error(`Rate limit exceeded: ${errorMessage}`);
        case 500:
          throw new Error(`Server error: ${errorMessage}`);
        default:
          throw new Error(errorMessage);
      }
    }

    try {
      return await response.json();
    } catch {
      return (await response.text()) as T;
    }
  }

  protected async get<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "GET",
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  protected async post<T = unknown>(
    endpoint: string,
    data: unknown = null,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  protected async put<T = unknown>(
    endpoint: string,
    data: unknown = null,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  protected async delete<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "DELETE",
      ...options,
    });
    return this.handleResponse<T>(response);
  }
}
