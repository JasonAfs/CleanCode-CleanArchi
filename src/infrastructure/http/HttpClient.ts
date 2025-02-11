// src/infrastructure/http/HttpClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthTokensDTO } from '@application/dtos/auth/AuthTokensDTO';

export interface HttpClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
}

export class HttpClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(
    config: HttpClientConfig,
    private readonly onTokenExpired?: () => Promise<AuthTokensDTO>,
  ) {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      timeout: config.timeout,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const tokens = await this.onTokenExpired?.();
            if (tokens?.accessToken) {
              this.setAuthorizationHeader(tokens.accessToken);
              this.refreshSubscribers.forEach((callback) =>
                callback(tokens.accessToken),
              );
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config,
    );
    return {
      data: response.data,
      status: response.status,
    };
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response: AxiosResponse<T> = await this.client.patch(
      url,
      data,
      config,
    );
    return {
      data: response.data,
      status: response.status,
    };
  }

  setAuthorizationHeader(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthorizationHeader(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }
}
