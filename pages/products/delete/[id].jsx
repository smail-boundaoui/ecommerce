import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../../Components/Layout"
import Loading from "../../../Components/Loading"

export default function Delete() {
  const router = useRouter()
  const [product, setProduct] = useState(null)

  const fetchProduct = async (id) => await (await fetch("/api/products/" + id)).json()
  const handleCancel = () => router.push("/products")
  const handleConfirm = async (id, categoryId) => {
    await (await fetch(`/api/products/${id}?categoryId=${categoryId}`, { method: "DELETE" })).json()
    router.push("/products")
  }

  useEffect(() => {
    router.isReady && fetchProduct(router.query.id).then((data) => setProduct(data))
  }, [router.isReady])

  const buttonStyle = {
    margin: "0 30px",
    padding: "5px 20px"
  }

  if (product)
    return (
      <Layout>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <h2 style={{ marginBottom: 40 }}>Delete Product {`"${product.name}"`}?</h2>
          <div>
            <button
              style={buttonStyle}
              onClick={(e) => handleConfirm(product._id, product.category)}
            >
              Confirm
            </button>
            <button style={buttonStyle} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </Layout>
    )

  return (
    <Layout>
      <Loading />
    </Layout>
  )
}
