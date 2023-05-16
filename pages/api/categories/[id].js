import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { ObjectId } from "mongodb"
import { findOne, updateOne, deleteOne, deleteMany, updateMany } from "../../../lib/mongo"

export default async function handler(req, res) {
  // Auth
  const session = await getServerSession(req, res, authOptions)
  if (!session.user.isAdmin) res.status(403).json("Not an Admin")

  // Check ID
  const { id } = req.query
  if (!ObjectId.isValid(id)) return res.json(null)

  // GET ONE
  if (req.method === "GET") {
    res.json(await findOne("categories", { _id: new ObjectId(id) }))
  }

  // UPDATE ONE
  if (req.method === "POST") {
    const [name, props] = JSON.parse(req.body)
    await updateOne(
      "categories",
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          props: props.map((p) => {
            return { name: p.name, value: p.value.split(",").filter((v) => v.length > 0) }
          })
        }
      }
    )
    await updateMany(
      "products",
      { category: new ObjectId(id) },
      {
        $set: {
          properties: [
            ...props.map((p) => {
              return { name: p.name, value: "" }
            })
          ]
        }
      }
    )

    return res.json("done")
  }

  // DELETE ONE
  if (req.method === "PUT") {
    const { del, products } = JSON.parse(req.body)
    await deleteOne("categories", { _id: new ObjectId(id) })
    if (del) await deleteMany("products", { category: new ObjectId(id) })
    else
      await updateMany(
        "products",
        { _id: { $in: [...products.map((prodId) => new ObjectId(prodId))] } },
        {
          $set: {
            category: "",
            properties: []
          }
        }
      )

    return res.json("done")
  }
}
