export interface LoginInput {
  username: string
  password: string
}

export interface RegisterInput extends LoginInput {
  email: string
}

export interface User {
  email: string
  token: string
}
