export interface User {
  id: string
  name: string
  profileEpic?: string
  experience: number
  position?: string | null
  team?: string | null
  rank: number
  firstName?: string
  lastName?: string
  nationality?: string
  flag?: string
}
  export interface UserWithRank extends User {
    rank: number
  }
  
  