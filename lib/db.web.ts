const rows: any[] = [];
export async function run(_sql: string, ..._params: any[]) {
  /* no-op */
}
export async function all<T = any>(_sql: string, ..._params: any[]): Promise<T[]> {
  return rows as T[];
}
export async function initDb() {
  /* no-op */
}
export function getDb() {
  return null as any;
}
