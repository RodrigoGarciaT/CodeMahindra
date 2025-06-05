export interface User {
  id: number
  name: string
  avatar: string
  flag: string
  experience: number // Cambiado de points a experience
}

export interface UserWithRank extends User {
  rank: number
}