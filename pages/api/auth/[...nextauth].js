import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          isAdmin: false,
          blocked: false,
          date: new Date()
        }
      }
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user._id = user.id
        session.user.isAdmin = true
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
