declare global {
  interface DataLayerEvent {
    event: string;
    event_category?: string;
    event_label?: string;
    [key: string]: string | number | boolean | undefined;
  }

  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetIdOrEventName: string | Date,
      params?: Record<string, string | number | boolean | undefined>
    ) => void;
    dataLayer?: DataLayerEvent[];
  }
}

export {};
