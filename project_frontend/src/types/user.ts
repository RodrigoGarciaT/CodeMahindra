export interface User {
    id: number
    name: string
    avatar: string
    nationality?: string;
    points: number
  }
  
  export interface UserWithRank extends User {
    rank: number
  }
  
  