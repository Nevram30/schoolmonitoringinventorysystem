import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

import * as yup from 'yup'
import authschema from '@/schema/auth.schema'

import { signJwtAccessToken } from './jwt'
import { db } from '@/server/db'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id_number: { label: 'ID Number', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        if (!credentials) {
          return null
        }

        const { id_number, password } = credentials

        try {
          // Validate form data with Yup schema
          authschema.validateSync({ id_number, password }, { abortEarly: false })

          // Everyone signs in with their school ID number. Accounts created
          // before the column existed have none, so they cannot sign in until
          // an admin fills it in on /admin/users.
          const user = await db.user.findUnique({
            where: { id_number: String(id_number).trim() },
          })

          if (!user) {
            throw new Error(
              JSON.stringify({
                success: false,
                error: {
                  general: 'Invalid ID number or password',
                },
              })
            )
          }

          if (!user.password) {
            throw new Error(
              JSON.stringify({
                success: false,
                error: {
                  general: 'Account exists but has no password set',
                },
              })
            )
          }

          // Check password - support both MD5 (legacy) and bcrypt
          let isPasswordValid = false;

          // First try MD5 (for seeded admin user)
          const md5Hash = crypto.createHash('md5').update(password).digest('hex');
          if (user.password === md5Hash) {
            isPasswordValid = true;
          } else {
            // If MD5 doesn't match, try bcrypt
            try {
              isPasswordValid = await bcrypt.compare(password, user.password);
            } catch {
              // If bcrypt fails, password is invalid
              isPasswordValid = false;
            }
          }

          if (!isPasswordValid) {
            throw new Error(
              JSON.stringify({
                success: false,
                error: {
                  general: 'Invalid ID number or password',
                },
              })
            )
          }

          const { password: pass, ...userWithoutPass } = user

          const accessToken = signJwtAccessToken(userWithoutPass)

          return {
            ...userWithoutPass,
            accessToken,
          }
        } catch (error) {
          if (error instanceof yup.ValidationError) {
            let errors = {}
            error.inner.forEach((result) => {
              errors = { ...errors, [result.path as any]: result.message }
            })

            throw new Error(
              JSON.stringify({
                success: false,
                error: errors,
              })
            )
          }

          // The failure branches above already throw the `{ success, error }`
          // envelope the login form parses — re-wrapping it would nest a JSON
          // string inside `error` and the form would print raw JSON.
          const message = (error as Error).message

          if (message.startsWith('{')) {
            throw error
          }

          throw new Error(
            JSON.stringify({
              success: false,
              error: { general: message },
              status: 500,
            })
          )
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store user data in token
        token.user = {
          id: Number(user.id),
          name: user.name,
          username: user.username,
          role: user.role,
          status: Number(user.status)
        }
      }
      return token
    },
    async session({ session, token }) {
      // Pass user data from token to session
      if (token.user) {
        session.user = token.user as any
      }
      return session
    },
  },
}

// Export alias for backward compatibility
export const options = authOptions;
