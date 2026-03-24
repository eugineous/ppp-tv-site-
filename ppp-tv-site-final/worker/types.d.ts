// Cloudflare Workers KV type stub
// Install @cloudflare/workers-types for full types: npm i -D @cloudflare/workers-types
declare interface KVNamespace {
  get(key: string): Promise<string | null>;
  get(key: string, type: 'json'): Promise<unknown>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
    keys: Array<{ name: string; expiration?: number }>;
    list_complete: boolean;
    cursor?: string;
  }>;
}

declare interface ScheduledEvent {
  cron: string;
  scheduledTime: number;
  noRetry(): void;
}
