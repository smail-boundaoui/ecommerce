import { useEffect, useState } from "react"
import Layout from "../../Components/Layout"
import ProductsList from "../../Components/ProductsList"
import Filter from "../../Components/Filter"
import Link from "next/link"

export default function Products() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState("all")
  const [name, setName] = useState("")

  const fetchData = async () => {
    const data = await (await fetch("/api/products")).json()
    const data2 = await (await fetch("/api/categories")).json()
    setProducts(data)
    setCategories(data2)
    setLoading(false)
  }

  const handleNameChange = async (value) => {
    setLoading(true)
    setName(value)
    setProducts(
      await (
        await fetch("/api/products/filter", {
          method: "POST",
          body: JSON.stringify({ name: value, categoryId: category })
        })
      ).json()
    )
    setLoading(false)
  }

  const handleCategoryChange = async (value) => {
    setLoading(true)
    setName("")
    setCategory(value)
    setProducts(
      value === "all"
        ? await (await fetch("/api/products")).json()
        : await (
            await fetch("/api/products", {
              method: "PUT",
              body: JSON.stringify({ categoryId: value })
            })
          ).json()
    )
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout>
      <div className="products-heading">
        <div>
          <h2>Products List</h2>
          <Link href="/products/add">Create Product</Link>
        </div>
        <Filter
          inputValue={name}
          inputPlaceHolder={"Search Product Name.."}
          handleInputValue={handleNameChange}
          selectValue={category}
          handleSelectValue={handleCategoryChange}
          selectArray={categories}
          selectLabel="Category"
          extraSelectOptions={
            <>
              <option value="all">All</option>
              <option value="none">No Category</option>
            </>
          }
        />
      </div>
      <ProductsList products={products} loading={loading} />
    </Layout>
  )
}
