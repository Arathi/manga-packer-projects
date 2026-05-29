namespace NHentaiXXX {
  interface GalleryThumb {
    ct: CoverThumb;
    fl: Record<string, string>;
    th: Record<string, string>;
  }

  interface CoverThumb {
    cover: string;
    thumb: string;
  }
}

interface Window {
  g_th: NHentaiXXX.GalleryThumb;
}
