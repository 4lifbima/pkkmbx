export type UserRole = 'admin' | 'student'

export interface AuthUser {
  id: number
  fullName: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface StudentProfile {
  id: number
  fullName: string
  email: string
  nim: string | null
  phone: string | null
  address: string | null
  birthPlace: string | null
  birthDate: string | null
  jurusan: string | null
  prodi: string | null
  fotoProfil: string | null
  hobi: string | null
  pesanKesan: string | null
  sertifikatUrl: string | null
  ktmUrl: string | null
}
