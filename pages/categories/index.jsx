import { useEffect, useState } from "react"
import Layout from "../../Components/Layout"
import Loading from "../../Components/Loading"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faTrash, faChevronDown } from "@fortawesome/free-solid-svg-icons"

export default function Categories() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await (await fetch("/api/categories")).json()

      setData(
        fetchedData.map((obj) => {
          return { ...obj, classProp: false }
        }) || []
      )
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleDropDown = (_id) => {
    setData((prevData) =>
      prevData.map((current) => {
        return {
          ...current,
          classProp: current._id === _id ? !current.classProp : current.classProp
        }
      })
    )
  }

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    )

  return (
    <Layout>
      <div className="categories">
        <div className="heading">
          <h2>Categories List</h2>
          <Link href="/categories/add">Create Category</Link>
        </div>
        {data.length <= 0 && (
          <p style={{ textAlign: "center", marginTop: 60 }}>No Categories Found!</p>
        )}
        {data.map((category) => {
          return (
            <div key={category._id} className="category">
              <div className="head">
                <h3>{category.name}</h3>
                <div className="prodNbr">
                  {category.products.length} <small>Products</small>
                </div>

                <button
                  onClick={(e) => handleDropDown(category._id)}
                  className={`${category.classProp ? "reverse" : ""} ${
                    category.props.length > 0 ? "" : "visibilty"
                  }`}
                >
                  Show Properties <FontAwesomeIcon icon={faChevronDown} />
                </button>

                <div className="control">
                  <Link href={`/categories/edit/${category._id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    Edit
                  </Link>
                  <Link href={`/categories/delete/${category._id}`}>
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </Link>
                </div>
              </div>
              <div className={`body ${category.classProp ? "" : "hidden"}`}>
                {category.props.map((prop) => {
                  return (
                    <div key={prop.name} className="property">
                      <div className="name">{prop.name}</div>
                      <div className="values">
                        {prop.value.map((val, i) => {
                          return (
                            <div key={i} className="value">
                              {val}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
