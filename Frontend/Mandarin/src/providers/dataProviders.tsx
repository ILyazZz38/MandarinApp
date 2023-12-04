import axios, { AxiosInstance, AxiosResponse } from 'axios';


export interface RequestOptions {
    method: 'get' | 'post' | 'put' | 'delete';
    url: string;
    data?: any;
    headers?: any;
}

export interface DataProviderResponse<T> {
    data?: T;
    total?: number;
}

export class DataProvider {
    private http: AxiosInstance;
    private token: string | null;

    constructor(url:string) {
        this.http = axios.create({
            baseURL: url || import.meta.env.VITE_BACKEND_API// process.env["BACKEND_API"] //'http://localhost/api',
        });

        // Set the token from local storage if it exists
        this.token = localStorage.getItem('token');
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    async request<T>({ method, url, data, headers }: RequestOptions): Promise<AxiosResponse<T>> {
        if (this.token) {
            headers = {
                ...headers,
                'Access-Control-Allow-Origin': '*'
            };
        }

        return this.http.request<T>({
            method,
            url,
            data,
            headers,
        });
    }

    async getList<T>(resource: string): Promise<DataProviderResponse<T[]>> {
        const { data } = await this.request<T[]>({
            method: 'get',
            url: `/${resource}`,
            //params
        });

        return { data, total: data.length };
    }

    async getListWithId<T>(resource: string,  id: string): Promise<DataProviderResponse<T[]>> {
        const { data } = await this.request<T[]>({
            method: 'get',
            url: `/${resource}/${id}`,
            //params
        });

        return { data, total: data.length };
    }

    async getOne<T>(resource: string, id: string): Promise<DataProviderResponse<T>> {
        const { data } = await this.request<T>({
            method: 'get',
            url: `/${resource}/${id}`,
        });

        return { data };
    }

    async getOneWithoutId<T>(resource: string): Promise<DataProviderResponse<T>> {
        const { data } = await this.request<T>({
            method: 'get',
            url: `/${resource}`,
        });

        return { data };
    }

    async create<T>(resource: string, data: any): Promise<DataProviderResponse<T>> {
        const { data: createdData } = await this.request<T>({
            method: 'post',
            url: `/${resource}`,
            data,
        });

        return { data: createdData };
    }

    async update<T>(resource: string, id: string, data: any): Promise<DataProviderResponse<T>> {
        const { data: updatedData } = await this.request<T>({
            method: 'put',
            url: `/${resource}/${id}`,
            data,
        });

        return { data: updatedData };
    }

    async delete<T>(resource: string, id: string): Promise<DataProviderResponse<T>> {
        const { data: deletedData } = await this.request<T>({
            method: 'delete',
            url: `/${resource}/${id}`,
        });

        return { data: deletedData };
    }
}

export default new DataProvider(import.meta.env.VITE_BACKEND_API || 'http://localhost:5079/api');