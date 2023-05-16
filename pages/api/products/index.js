import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { insert, findMany, updateOne } from "../../../lib/mongo"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  // Auth
  const session = await getServerSession(req, res, authOptions)
  if (!session.user.isAdmin) res.status(403).json("Not an Admin")

  // ADD ONE
  if (req.method === "POST") {
    const data = JSON.parse(req.body)
    const product = {
      ...data,
      category: ObjectId.isValid(data.category) ? new ObjectId(data.category) : ""
    }
    const { insertedIds } = await insert("products", product)
    if (data.category)
      await updateOne(
        "categories",
        { _id: new ObjectId(data.category) },
        { $push: { products: insertedIds[0] } }
      )
    res.json("done")
  }

  // GET ALL
  if (req.method === "GET") res.json(await findMany("products"))

  // GET ALL BY CATEGORY
  if (req.method === "PUT") {
    const { categoryId } = JSON.parse(req.body)
    res.json(
      await findMany("products", {
        category: ObjectId.isValid(categoryId) ? new ObjectId(categoryId) : ""
      })
    )
  }
}
