import { GM } from "$";

let DEFAULT_TITLE = GM.info.script.name;
if (DEFAULT_TITLE.startsWith("server:")) {
  DEFAULT_TITLE = DEFAULT_TITLE.substring(7);
}

type Notification = {
  text: string;
  title?: string;
  tag?: string;
  silent?: boolean;
  timeout?: number;
};

export async function notification({
  text,
  title = DEFAULT_TITLE,
  tag = crypto.randomUUID(),
  silent = false,
  timeout,
}: Notification): Promise<string | null> {
  const success = await GM.notification({
    text,
    title,
    tag,
    silent,
    timeout,
  });
  return success ? tag : null;
}
