export {};

declare global {
  interface Window {
    electronAPI: {
      yourFunction: () => void;
      ping: () => Promise<string>;
      fetchHistory: () => Promise<any>;
      generateTitle: (text: string) => Promise<string>;
    };
  }
}
