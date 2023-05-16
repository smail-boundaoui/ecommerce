import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Product from "../../../Components/Product"
import Layout from "../../../Components/Layout"
import Loading from "../../../Components/Loading"

export default function Edit() {
  const router = useRouter()
  const [product, setProduct] = useState(null)

  const fetchProduct = async (id) => await (await fetch("/api/products/" + id)).json()

  useEffect(() => {
    router.isReady && fetchProduct(router.query.id).then((data) => setProduct(data))
  }, [router.isReady])

  if (product)
    return (
      <Layout>
        <Product title="Edit Product" product={product} />
      </Layout>
    )

  return (
    <Layout>
      <Loading />
    </Layout>
  )
}
