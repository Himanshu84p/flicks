import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
};

class ApiClient {
  private async fetchApi<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos() {
    const videos = this.fetchApi<IVideo[]>("/videos"); 
    return videos;
  }

  async getAVideo(id: string) {
    return this.fetchApi<IVideo>(`/video/${id}`);
  }

  async createVideo(videoData: VideoFormData) {
    const options: FetchOptions = {
      method: "POST",
      body: videoData,
    };
    return this.fetchApi("/videos", options);
  }
}

export const apiClient = new ApiClient();
