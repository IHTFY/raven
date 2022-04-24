import { writable } from "svelte/store";

export const answers = writable([]);
export const cells = writable(Array(3).fill(Array(3).fill(0)));
export const theme = writable("light");