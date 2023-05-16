import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI)

export default async function handler(req, res) {
  // Auth
  const session = await getServerSession(req, res, authOptions)
  if (!session.user.isAdmin) res.status(403).json("Not an Admin")

  // GET INFO
  if (req.method === "GET") {
    const collections = { products: 0, categories: 0, orders: 0, users: 0 }
    await client.connect()
    for (const collection in collections)
      collections[collection] = await client.db().collection(collection).countDocuments()
    collections.admins = await client.db().collection("users").countDocuments({ isAdmin: true })
    client.close()
    res.json(collections)
  }
}
