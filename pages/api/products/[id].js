import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { ObjectId } from "mongodb"
import { findOne, updateOne, deleteOne } from "../../../lib/mongo"

export default async function handler(req, res) {
  // Auth
  const session = await getServerSession(req, res, authOptions)
  if (!session.user.isAdmin) res.status(403).json("Not an Admin")

  // Check ID
  const { id } = req.query
  if (!ObjectId.isValid(id)) return res.json(null)

  // GET ONE
  if (req.method === "GET") res.json(await findOne("products", { _id: new ObjectId(id) }))

  // DELETE ONE
  if (req.method === "DELETE") {
    const { categoryId } = req.query
    await deleteOne("products", { _id: new ObjectId(id) })
    if (ObjectId.isValid(categoryId))
      await updateOne(
        "categories",
        { _id: new ObjectId(categoryId) },
        {
          $pull: { products: new ObjectId(id) }
        }
      )
    res.json("done")
  }

  // UPDATE ONE
  if (req.method === "PUT") {
    const data = JSON.parse(req.body)
    if (data.prevCategory !== data.newProduct.category && data.prevCategory) {
      await updateOne(
        "categories",
        { _id: new ObjectId(data.prevCategory) },
        {
          $pull: { products: new ObjectId(id) }
        }
      )
    }

    await updateOne(
      "products",
      { _id: new ObjectId(id) },
      {
        $set: {
          name: data.newProduct.name,
          desc: data.newProduct.desc,
          price: data.newProduct.price,
          images: data.newProduct.images,
          category: new ObjectId(data.newProduct.category),
          properties: data.newProduct.properties
        }
      }
    )

    if (data.prevCategory !== data.newProduct.category && data.newProduct.category) {
      await updateOne(
        "categories",
        { _id: new ObjectId(data.newProduct.category) },
        { $push: { products: new ObjectId(id) } }
      )
    }

    res.json("done")
  }
}
