import { Manifest } from "@/domains/manifest";
import { Task } from "@/domains/task";
import { Adapter } from "./adapter";

const DOMAIN = "telegra.ph";

export class TelegraphAdapter implements Adapter {
  matched(): boolean {
    const url = new URL(location.href);
    return url.origin == DOMAIN && url.pathname.length > 1;
  }

  async manifest(): Promise<Manifest> {
    const page = window.T;
    if (page == null) {
      throw new Error();
    }
    const { pageId } = page;
    const id = `tg-${pageId}`;

    const h1 = document.querySelector<HTMLHeadingElement>(
      "main.tl_article header.tl_article_header h1",
    );
    if (h1 == null) {
      throw new Error();
    }
    const name = h1.innerText;

    return {
      id,
      name,
    };
  }

  async tasks(id: string): Promise<Task[]> {
    const imgs = document.querySelectorAll<HTMLImageElement>(
      "article#_tl_editor figure img",
    );
    const amount = imgs.length;
    const fileNameLength = Math.ceil(Math.log10(amount + 1));
    const tasks: Task[] = [];
    imgs.forEach((img, index) => {
      const fileName = `${index + 1}`.padStart(fileNameLength, "0");
      const url = img.src;
      tasks.push({
        id: `${id}-${fileName}`,
        fileName,
        url,
      });
    });
    return tasks;
  }
}
