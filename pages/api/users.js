import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { findMany, findOne, updateOne } from "../../lib/mongo"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  // Auth
  const session = await getServerSession(req, res, authOptions)
  if (!session.user.isAdmin) res.status(403).json("Not an Admin")

  // GET ALL
  if (req.method === "GET")
    res.json((await findMany("users")).filter((user) => String(user._id) !== session.user._id))

  // UPDATE ONE
  if (req.method === "PUT") {
    const { _id, action } = JSON.parse(req.body)
    if (!ObjectId.isValid(_id)) return res.json("ID not Valid!")
    await updateOne("users", { _id: new ObjectId(_id) }, { $set: { blocked: action === "block" } })
    res.json(await findOne("users", { _id: new ObjectId(_id) }))
  }

  // FILTER
  if (req.method === "POST") {
    const { email, blocked } = JSON.parse(req.body)
    const filter = {}
    if (email) filter.email = email
    if (blocked === "blocked") filter.blocked = true
    else if (blocked === "admins") filter.isAdmin = true
    else if (blocked === "unBlocked") {
      filter.blocked = false
      filter.isAdmin = false
    }
    res.json(
      (await findMany("users", filter)).filter((user) => String(user._id) !== session.user._id)
    )
  }
}
