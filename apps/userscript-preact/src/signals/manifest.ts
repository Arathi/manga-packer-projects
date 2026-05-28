import { signal } from "@preact/signals";
import { Manifest } from "../domains/manifest";

export const manifest = signal<Manifest | null>(null);
