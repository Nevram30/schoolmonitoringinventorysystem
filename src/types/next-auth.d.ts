import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      name: string
      username: string
      role: 'admin' | 'faculty' | 'staff' | 'student'
      status: number
      /** Still signed in with the temporary password from the welcome e-mail. */
      mustChangePassword: boolean
    }
  }

  interface User {
    id: number
    name: string
    username: string
    role: 'admin' | 'faculty' | 'staff' | 'student'
    status: number
    must_change_password: boolean
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number
      name: string
      username: string
      role: 'admin' | 'faculty' | 'staff' | 'student'
      status: number
      mustChangePassword: boolean
    }
  }
}
