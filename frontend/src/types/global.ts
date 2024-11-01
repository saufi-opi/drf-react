export interface Group {
  id: number
  name: string
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  groups: Group[]
  last_login?: string
}