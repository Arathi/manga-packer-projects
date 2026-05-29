import { useComputed } from "@preact/signals";
import { downloadZip } from "client-zip";
import { ComponentChildren } from "preact";
import { GM } from "$";

import { TelegraphAdapter } from "./adapters/telegraph";
import TotalProgress from "./components/total-progress";
import Filter from "./components/filter";
import { Task, TaskStatus } from "./domains/task";
import { manifest } from "./signals/manifest";
import { tasks, update } from "./signals/tasks";
import TaskView from "./components/task-view";
import { sleep } from "./utils/time";
import { download } from "./utils/monkey/download";

import styles from "./app.module.scss";

const root = await navigator.storage.getDirectory();

const App = () => {
  const version = GM.info.script.version;

  const success = useComputed(
    () => tasks.value.filter((it) => it.status === TaskStatus.Success).length,
  );

  const fetchDisabled = false;
  const downloadDisabled = useComputed(() => {
    return tasks.value.length == 0;
  });
  const packDisabled = useComputed(
    () => tasks.value.length > 0 && success.value !== tasks.value.length,
  );

  async function fetch() {
    const adapter = new TelegraphAdapter();
    manifest.value = await adapter.manifest();
    console.info(manifest.value);
    tasks.value = await adapter.tasks(manifest.value.id);
    console.info(tasks.value);

    const dir = await root.getDirectoryHandle(manifest.value.id, {
      create: true,
    });

    for await (const [name, fsHandle] of dir) {
      if (fsHandle.kind === "file") {
        const fileHandle = fsHandle as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        const dot = name.lastIndexOf(".");
        const fileName = name.substring(0, dot);
        update({
          id: `${manifest.value.id}-${fileName}`,
          status: TaskStatus.Success,
          loaded: file.size,
          total: file.size,
        });
      }
    }
  }

  async function downloadTasks() {
    for (const task of tasks.value) {
      const { status = TaskStatus.Pending } = task;
      if (status === TaskStatus.Pending || status === TaskStatus.Failure) {
        downloadTask(task);
        await sleep(100);
      }
    }
  }

  async function downloadTask(task: Task) {
    if (manifest.value == null) {
      return;
    }

    console.info(`开始下载 ${task.id}`);
    const Referer = location.origin;
    const blob = await download({
      url: task.url,
      headers: { Referer },
      onProgress: (loaded, total) => {
        console.info(`下载任务 ${task.id} 进度更新 ${loaded} / ${total}`);
        update({
          status: TaskStatus.Running,
          loaded,
          total,
        });
      },
    });

    console.info(`任务 ${task.id} 下载完成`, blob);
    update({
      id: task.id,
      status: TaskStatus.Success,
      loaded: blob.size,
      total: blob.size,
    });

    let ext = "";
    switch (blob.type) {
      case "image/jpeg":
        ext = ".jpg";
        break;
      case "image/png":
        ext = ".png";
        break;
      case "image/webp":
        ext = ".webp";
        break;
      default:
        ext = "";
        break;
    }

    const dir = await root.getDirectoryHandle(manifest.value.id, {
      create: true,
    });
    const fileName = `${task.fileName}${ext}`;
    const file = await dir.getFileHandle(fileName, { create: true });
    const writer = await file.createWritable();
    await writer.write(blob);
    await writer.close();
    console.info(`文件 ${fileName} 写入OPFS完成`);
  }

  async function pack() {
    if (manifest.value == null) {
      return;
    }

    const dir = await root.getDirectoryHandle(manifest.value.id, {
      create: true,
    });

    const files: File[] = [];
    for await (const [name, fsHandle] of dir) {
      if (fsHandle.kind === "file") {
        const fileHandle = fsHandle as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        files.push(file);
      }
    }

    const zip = await downloadZip(files).blob();
    console.info(`zip文件创建完成`, zip);
    GM.download({
      url: URL.createObjectURL(zip),
      name: `${manifest.value.name}.cbz`,
    });
  }

  const taskViews: ComponentChildren[] = [];
  for (const task of tasks.value) {
    taskViews.push(<TaskView key={task.id} {...task} />);
  }

  return (
    <>
      <div className={styles.app}>
        <div className={styles.header}>
          <button type="button" onClick={fetch} disabled={fetchDisabled}>
            获取
          </button>
          <button
            type="button"
            onClick={downloadTasks}
            disabled={downloadDisabled}
          >
            下载
          </button>
          <button type="button" onClick={pack} disabled={packDisabled}>
            打包
          </button>
          <div className={styles.version}>v{version}</div>
        </div>
        <div className={styles.progress}>
          <TotalProgress />
        </div>
        <div className={styles.filter}>
          <Filter />
        </div>
        <div className={styles.tasks}>{taskViews}</div>
      </div>
    </>
  );
};

export default App;
