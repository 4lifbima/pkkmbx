const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  `${window.location.protocol}//${window.location.hostname}:8000`

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  token?: string | null
  body?: unknown
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message ?? 'Terjadi kesalahan pada server.')
  }
  return data as T
}

export async function apiUpload<T>(path: string, file: File, fieldName: string, token?: string | null): Promise<T> {
  const formData = new FormData()
  formData.append(fieldName, file)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message ?? 'Upload gagal.')
  }
  return data as T
}
