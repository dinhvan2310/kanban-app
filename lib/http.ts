/* eslint-disable @typescript-eslint/no-explicit-any */
type CustomRequestInit = RequestInit & { baseUrl?: string };

class HttpError<T> extends Error {
    status: number;
    payload: T;
    constructor({ status, payload }: { status: number; payload: T }) {
        super("Http Error");
        this.status = status;
        this.payload = payload;
    }
}

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options: CustomRequestInit = {}
): Promise<{
    status: number;
    payload: Response;
}> => {
    const body = options.body ? JSON.stringify(options.body) : undefined;
    const headers = {
        ...options.headers,
        method,
        "Content-Type": "application/json",
    };

    const baseUrl = options?.baseUrl || process.env.NEXT_PUBLIC_BASE_URL;

    const fullUrl = url.startsWith("/")
        ? `${baseUrl}${url}`
        : `${baseUrl}/${url}`;

    const response = await fetch(fullUrl, {
        ...options,
        body,
        headers,
        method,
    });

    const payload: Response = await response.json();
    const data = {
        status: response.status,
        payload,
    };

    if (!response.ok) {
        throw new HttpError(data);
    }

    return data
};

const http = {
  get<Response>(url: string, options?: Omit<CustomRequestInit, 'body'>) {
    return request<Response>('GET', url, options);
  },
  post<Response>(url: string, body: any, options?: Omit<CustomRequestInit, 'body'>) {
    return request<Response>('POST', url, { ...options, body });
  },
  put<Response>(url: string, body: any, options?: Omit<CustomRequestInit, 'body'>) {
    return request<Response>('PUT', url, { ...options, body });
  },
  delete<Response>(url: string, body: any, options?: Omit<CustomRequestInit, 'body'>) {
    return request<Response>('DELETE', url, { ...options, body });
  },
}

export default http;