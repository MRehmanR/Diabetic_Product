const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type QueryResult<T = unknown> = { data: T | null; error: { message: string } | null };
type Filter = { column: string; value: unknown };

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("access_token");
}

function setTokens(tokens: { access_token: string; refresh_token: string }) {
  window.localStorage.setItem("access_token", tokens.access_token);
  window.localStorage.setItem("refresh_token", tokens.refresh_token);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<QueryResult<T>> {
  try {
    const token = getAccessToken();
    const headers = new Headers(options.headers);
    if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (response.status === 204) return { data: null, error: null };

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return { data: null, error: { message: payload?.detail || "Request failed" } };
    }
    return { data: payload as T, error: null };
  } catch (error) {
    return { data: null, error: { message: error instanceof Error ? error.message : "Network error" } };
  }
}

class QueryBuilder<T = unknown> implements PromiseLike<QueryResult<T>> {
  private filters: Filter[] = [];
  private sortColumn = "";
  private ascending = true;
  private mode: "select" | "insert" | "update" | "delete" = "select";
  private payload: unknown;
  private wantsSingle = false;
  private rowLimit: number | null = null;

  constructor(private table: "supplies" | "offers") {}

  select(_columns = "*") {
    this.mode = "select";
    return this;
  }

  insert(payload: unknown) {
    this.mode = "insert";
    this.payload = Array.isArray(payload) ? payload[0] : payload;
    return this;
  }

  update(payload: unknown) {
    this.mode = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.mode = "delete";
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push({ column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.sortColumn = column;
    this.ascending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.rowLimit = count;
    return this;
  }

  single() {
    this.wantsSingle = true;
    return this;
  }

  then<TResult1 = QueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<QueryResult<T>> {
    if (this.mode === "select") return this.selectRequest();
    if (this.mode === "insert") return this.insertRequest();
    if (this.mode === "update") return this.updateRequest();
    return this.deleteRequest();
  }

  private async selectRequest(): Promise<QueryResult<T>> {
    if (this.table === "supplies") {
      const slug = this.filters.find((f) => f.column === "slug")?.value;
      const result = slug
        ? await request<unknown>(`/supplies/${encodeURIComponent(String(slug))}`)
        : await request<unknown[]>("/supplies");
      if (result.error) return result as QueryResult<T>;
      const data = Array.isArray(result.data) ? this.applyLocalFilters(result.data) : result.data;
      return { data: data as T, error: null };
    }

    const result = await request<unknown[]>("/admin/offers");
    if (result.error) return result as QueryResult<T>;
    const rows: unknown[] = Array.isArray(result.data) ? result.data : [];
    const data = this.applyLocalFilters(rows);
    return { data: (this.wantsSingle ? data[0] || null : data) as T, error: null };
  }

  private async insertRequest(): Promise<QueryResult<T>> {
    const path = this.table === "supplies" ? "/admin/supplies" : "/offers";
    return request<T>(path, { method: "POST", body: JSON.stringify(this.payload) });
  }

  private async updateRequest(): Promise<QueryResult<T>> {
    const id = this.filters.find((f) => f.column === "id")?.value;
    if (!id) return { data: null, error: { message: "Missing id filter" } };
    const path = this.table === "supplies" ? `/admin/supplies/${id}` : `/admin/offers/${id}`;
    return request<T>(path, { method: "PUT", body: JSON.stringify(this.payload) });
  }

  private async deleteRequest(): Promise<QueryResult<T>> {
    const id = this.filters.find((f) => f.column === "id")?.value;
    if (!id) return { data: null, error: { message: "Missing id filter" } };
    const path = this.table === "supplies" ? `/admin/supplies/${id}` : `/admin/offers/${id}`;
    return request<T>(path, { method: "DELETE" });
  }

  private applyLocalFilters(rows: unknown[]): unknown[] {
    let data = rows.filter((row) =>
      this.filters.every((filter) => {
        if (filter.column === "slug") return true;
        return (row as Record<string, unknown>)[filter.column] === filter.value;
      })
    );

    if (this.sortColumn) {
      data = [...data].sort((a, b) => {
        const left = (a as Record<string, unknown>)[this.sortColumn];
        const right = (b as Record<string, unknown>)[this.sortColumn];
        const value = String(left ?? "").localeCompare(String(right ?? ""));
        return this.ascending ? value : -value;
      });
    }

    if (this.rowLimit !== null) {
      data = data.slice(0, this.rowLimit);
    }

    return data;
  }
}

export const apiClient = {
  from(table: "supplies" | "offers") {
    return new QueryBuilder(table);
  },
  auth: {
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const result = await request<{ access_token: string; refresh_token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (result.data) setTokens(result.data);
      return { data: result.data ? { session: result.data } : null, error: result.error };
    },
    async signUp({ email, password }: { email: string; password: string }) {
      const created = await request("/auth/setup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (created.error) return { data: null, error: created.error };
      return this.signInWithPassword({ email, password });
    },
    async getSession() {
      const token = getAccessToken();
      if (!token) return { data: { session: null }, error: null };
      const result = await request("/auth/me");
      if (result.error) return { data: { session: null }, error: result.error };
      return { data: { session: { access_token: token, user: result.data } }, error: null };
    },
    async signOut() {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("refresh_token");
      }
      return { error: null };
    },
  },
};
