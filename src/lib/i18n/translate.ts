import type { Locale } from "./types";
import { messages } from "./messages";

export type MessageKey = keyof (typeof messages)["ar"];

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>
): string {
  let text: string = messages.ar[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}
