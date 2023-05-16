import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { findMany, updateOne } from "../../lib/mongo"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  // Auth
  const session = await getServerSession(req, res, authOptions)
  if (!session.user.isAdmin) res.status(403).json("Not an Admin")

  // GET ALL
  if (req.method === "GET")
    res.json(
      (await findMany("users", { isAdmin: true })).filter(
        (user) => String(user._id) !== session.user._id
      )
    )

  // ADD ONE
  if (req.method === "POST")
    res.json(
      await updateOne("users", { email: JSON.parse(req.body).email }, { $set: { isAdmin: true } })
    )

  // DELETE ONE
  if (req.method === "PUT") {
    await updateOne(
      "users",
      { _id: new ObjectId(JSON.parse(req.body)._id) },
      { $set: { isAdmin: false } }
    )
    res.json("done")
  }
}
