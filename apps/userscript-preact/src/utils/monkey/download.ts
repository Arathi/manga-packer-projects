import { GM } from "$";

type OnProgressListener = (loaded: number, total: number) => void;

type RequestOptions = {
  url: string;
  headers?: Record<string, string>;
  onProgress?: OnProgressListener;
};

export function head({ url, headers }: RequestOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "HEAD",
      url,
      headers,
      onload: (event) => {
        console.debug(`HEAD ${url} 完成: `, event);
        resolve();
      },
      onerror: (event) => {
        console.error(`HEAD ${url} 失败`, event);
        reject(`HEAD ${url} 失败`);
      },
    });
  });
}

export function download({ url, headers, onProgress }: RequestOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url,
      headers,
      responseType: "blob",
      onload: (event) => {
        console.debug(`下载 ${url} 完成: `, event);
        resolve(event.response);
      },
      onprogress: (event) => {
        const { loaded, total } = event;
        if (onProgress != null) {
          onProgress(loaded, total);
        } else {
          console.debug(`下载 ${url} 进度：${loaded} / ${total}`);
        }
      },
      onerror: () => {
        reject(`下载 ${url} 失败`);
      },
    });
  });
}
