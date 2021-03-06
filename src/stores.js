import { writable } from "svelte/store";

export const currentQuestion = writable(1);
export const cells = writable(Array(3).fill(Array(3).fill(0)));
export const answers = writable([]);
export const theme = writable("neu-light");