const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type QueryResult<T = unknown> = { data: T | null; error: { message: string } | null };
type Filter = { column: string; value: unknown };

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("access_token");
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("refresh_token");
}

function setTokens(tokens: { access_token: string; refresh_token: string }) {
  window.localStorage.setItem("access_token", tokens.access_token);
  window.localStorage.setItem("refresh_token", tokens.refresh_token);
}

function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
}

async function parseError(response: Response) {
  const payload = await response.json().catch(() => null);
  return payload?.detail || "Request failed";
}

async function rawRequest<T>(path: string, options: RequestInit = {}): Promise<QueryResult<T>> {
  try {
    const token = getAccessToken();
    const headers = new Headers(options.headers);
    if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (response.status === 204) return { data: null, error: null };
    if (!response.ok) return { data: null, error: { message: await parseError(response) } };
    return { data: (await response.json()) as T, error: null };
  } catch (error) {
    return { data: null, error: { message: error instanceof Error ? error.message : "Network error" } };
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<QueryResult<T>> {
  const first = await rawRequest<T>(path, options);
  if (!first.error || first.error.message !== "Invalid token") return first;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return first;

  const refreshed = await rawRequest<{ access_token: string; refresh_token: string }>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!refreshed.data) {
    clearTokens();
    return first;
  }

  setTokens(refreshed.data);
  return rawRequest<T>(path, options);
}

class QueryBuilder<T = unknown> implements PromiseLike<QueryResult<T>> {
  private filters: Filter[] = [];
  private sortColumn = "";
  private ascending = true;
  private mode: "select" | "insert" | "update" | "delete" = "select";
  private payload: unknown;

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

  then<TResult1 = QueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
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
    const result =
      this.table === "supplies"
        ? await request<unknown[]>("/supplies")
        : await request<unknown[]>("/admin/offers");
    if (result.error) return result as QueryResult<T>;
    const rows = Array.isArray(result.data) ? result.data : [];
    return { data: this.applyLocalSort(rows) as T, error: null };
  }

  private insertRequest(): Promise<QueryResult<T>> {
    const path = this.table === "supplies" ? "/admin/supplies" : "/offers";
    return request<T>(path, { method: "POST", body: JSON.stringify(this.payload) });
  }

  private updateRequest(): Promise<QueryResult<T>> {
    const id = this.filters.find((f) => f.column === "id")?.value;
    if (!id) return Promise.resolve({ data: null, error: { message: "Missing id filter" } });
    const path = this.table === "supplies" ? `/admin/supplies/${id}` : `/admin/offers/${id}`;
    return request<T>(path, { method: "PUT", body: JSON.stringify(this.payload) });
  }

  private deleteRequest(): Promise<QueryResult<T>> {
    const id = this.filters.find((f) => f.column === "id")?.value;
    if (!id) return Promise.resolve({ data: null, error: { message: "Missing id filter" } });
    const path = this.table === "supplies" ? `/admin/supplies/${id}` : `/admin/offers/${id}`;
    return request<T>(path, { method: "DELETE" });
  }

  private applyLocalSort(rows: unknown[]) {
    if (!this.sortColumn) return rows;
    return [...rows].sort((a, b) => {
      const left = (a as Record<string, unknown>)[this.sortColumn];
      const right = (b as Record<string, unknown>)[this.sortColumn];
      const value = String(left ?? "").localeCompare(String(right ?? ""));
      return this.ascending ? value : -value;
    });
  }
}

export const adminApi = {
  from(table: "supplies" | "offers") {
    return new QueryBuilder(table);
  },
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    return request<{ url: string; filename: string }>("/uploads/image", {
      method: "POST",
      body: formData,
    });
  },
  auth: {
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const result = await rawRequest<{ access_token: string; refresh_token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (result.data) setTokens(result.data);
      return { data: result.data ? { session: result.data } : null, error: result.error };
    },
    async signUp({ email, password }: { email: string; password: string }) {
      const created = await rawRequest("/auth/setup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (created.error) return { data: null, error: created.error };
      return this.signInWithPassword({ email, password });
    },
    async forgotPassword(email: string) {
      return rawRequest<{ message: string; reset_url?: string | null }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    async resetPassword({ token, password }: { token: string; password: string }) {
      return rawRequest<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
    },
    async getSession() {
      const token = getAccessToken();
      if (!token) return { data: { session: null }, error: null };
      const result = await request("/auth/me");
      if (result.error) return { data: { session: null }, error: result.error };
      return { data: { session: { access_token: token, user: result.data } }, error: null };
    },
    async signOut() {
      clearTokens();
      return { error: null };
    },
  },
};
