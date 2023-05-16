import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { ObjectId, MongoClient } from "mongodb"

export default async function handler(req, res) {
  // Auth
  const session = await getServerSession(req, res, authOptions)
  if (!session.user.isAdmin) res.status(403).json("Not an Admin")

  if (req.method === "POST") {
    const { name, categoryId } = JSON.parse(req.body)

    const client = new MongoClient(process.env.MONGODB_URI)
    client.db().collection("products").createIndex({ name: "text", description: "text" })

    const filter = {
      $text: { $search: name, $caseSensitive: false },
      category: ObjectId.isValid(categoryId) ? new ObjectId(categoryId) : ""
    }

    if (categoryId === "all") delete filter.category
    if (name === "") delete filter.$text

    res.json(await client.db().collection("products").find(filter).toArray())

    client.close()
  }
}
