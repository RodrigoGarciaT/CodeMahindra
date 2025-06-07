export interface User {
  id: string
  name: string
  avatar?: string
  experience: number
  position?: string | null
  team?: string | null
  rank: number
  firstName?: string
  lastName?: string
  nationality?: string
}
  export interface UserWithRank extends User {
    rank: number
  }
  
  