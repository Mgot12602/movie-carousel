/**
 * Base API configuration options
 */
export interface BaseApiOptions {
  headers?: Record<string, string>;
  timeout?: number;
  authToken?: string;
}

/**
 * HTTP request options
 */
export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Base API class with common fetch logic and error handling
 */
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
    this.timeout = options.timeout || 10000; // 10 seconds default
  }

  /**
   * Create fetch request with timeout
   */
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

  /**
   * Handle HTTP response and errors
   */
  private async handleResponse<T = any>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      // Try to get error details from response body
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If response body is not JSON, use status text
      }

      // Handle specific status codes
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

    // Try to parse JSON response
    try {
      return await response.json();
    } catch {
      // If not JSON, return text
      return (await response.text()) as T;
    }
  }

  /**
   * GET request
   */
  protected async get<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log("url in base api", url);
    const response = await this.fetchWithTimeout(url, {
      method: "GET",
      ...options,
    });
    console.log("response", response);
    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  protected async post<T = any>(
    endpoint: string,
    data: any = null,
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

  /**
   * PUT request
   */
  protected async put<T = any>(
    endpoint: string,
    data: any = null,
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

  /**
   * DELETE request
   */
  protected async delete<T = any>(
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
