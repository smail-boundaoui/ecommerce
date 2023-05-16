import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../../Components/Layout"
import Loading from "../../../Components/Loading"

export default function Edit() {
  const router = useRouter()
  const [data, setData] = useState(null)

  const fetchData = async (id) => await (await fetch("/api/categories/" + id)).json()

  useEffect(() => {
    router.isReady && fetchData(router.query.id).then((result) => setData(result))
  }, [router.isReady])

  const handleCancel = () => router.push("/categories")

  const handleConfirm = (id, del) => {
    fetch("/api/categories/" + id, {
      method: "PUT",
      body: JSON.stringify({ del, products: data.products })
    })
      .then((res) => res.json())
      .then((_) => router.push("/categories"))
  }

  const buttonStyle = {
    margin: "0 30px",
    padding: "5px 20px"
  }

  return (
    <Layout>
      {data ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <h2 style={{ marginBottom: 40 }}>Delete Category {`"${data.name}"`}?</h2>
          <div>
            {data.products.length > 0 ? (
              <>
                <p style={{ marginBottom: 60 }}>
                  {`"${data.name}"`} Category has <b>{data.products.length}</b> Products!{" "}
                </p>
                <button style={buttonStyle} onClick={(e) => handleConfirm(data._id, true)}>
                  Delete Products
                </button>
                <button style={buttonStyle} onClick={(e) => handleConfirm(data._id, false)}>
                  Keep Products
                </button>
                <button style={buttonStyle} onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button style={buttonStyle} onClick={(e) => handleConfirm(data._id, true)}>
                  Confirm
                </button>
                <button style={buttonStyle} onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Layout>
  )
}
