import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { insert, findOne, findMany, updateOne } from "../../../lib/mongo"

export default async function handler(req, res) {
  // Auth
  const session = await getServerSession(req, res, authOptions)
  if (!session.user.isAdmin) res.status(403).json("Not an Admin")

  // ADD ONE
  if (req.method === "POST") {
    const [name, props] = JSON.parse(req.body)
    if (await findOne("categories", { name })) return res.json("exist")
    await insert("categories", {
      name,
      props: props.map((p) => {
        return { name: p.name, value: p.value.split(",").filter((v) => v.length > 0) }
      }),
      products: []
    })
    return res.json("done")
  }

  // GET ALL
  if (req.method === "GET") return res.json(await findMany("categories"))
}
