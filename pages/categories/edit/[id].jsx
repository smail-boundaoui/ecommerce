import Categorie from "../../../Components/Categorie"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../../Components/Layout"
import Loading from "../../../Components/Loading"

export default function Edit() {
  const router = useRouter()
  const [categorie, setCategorie] = useState(null)

  const fetchCategory = async (id) => await (await fetch("/api/categories/" + id)).json()

  useEffect(() => {
    router.isReady && fetchCategory(router.query.id).then((data) => setCategorie(data))
  }, [router.isReady])

  return categorie ? (
    <Categorie categorie={categorie} title="Edit" />
  ) : (
    <Layout>
      <Loading />
    </Layout>
  )
}
