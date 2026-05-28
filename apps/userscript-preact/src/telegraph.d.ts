interface Telegraph {
  apiUrl: string;
  datetime: number;
  editable: boolean;
  pageId: string;
  reportHash: string;
  saveHash: string;
  uploadEnabled: boolean;
}

interface Window {
  T: Telegraph;
}
