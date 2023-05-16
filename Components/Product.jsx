import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpFromBracket, faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Loading from "./Loading"

export default function Product({ title = "Create a New Product", product }) {
  const [name, setName] = useState(product?.name || "")
  const [desc, setDesc] = useState(product?.desc || "")
  const [price, setPrice] = useState(product?.price || "")
  const [images, setImages] = useState(product?.images || [])
  const [categories, setCategories] = useState([])
  const [categoryProps, setCategoryProps] = useState([])
  const [category, setCategory] = useState(product?.category || "")
  const [properties, setProperties] = useState(product?.properties || [])
  const [errMsg, setErrMsg] = useState(null)
  const [isAdded, setIsAdded] = useState(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await (await fetch("/api/categories")).json()
      setCategories(data)
      if (product)
        for (let i = 0; i < data.length; i++)
          if (data[i]._id === product.category) setCategoryProps(data[i].props)
    }
    fetchCategories()
  }, [])

  const handleName = (value) => setName(value)

  const handleDesc = (value) => setDesc(value)

  const handlePrice = (value) => setPrice(Math.abs(Number(value)))

  const handleCategory = (value, data = []) => {
    if (!value) {
      setCategory("")
      setProperties([])
      setCategoryProps([])
      return
    }
    setCategory(value)
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      if (category._id === value) {
        setProperties(
          category.props.map((prop) => {
            return { name: prop.name, value: "" }
          })
        )
        setCategoryProps(category.props)
        return
      }
    }
  }

  const handleProps = (propName, propValue) => {
    setProperties((prevProperties) => {
      return prevProperties.map((prop) => {
        return { ...prop, value: propName === prop.name ? propValue : prop.value }
      })
    })
  }

  const handleImageRemove = (src) =>
    setImages((prevImages) => prevImages.filter((img) => img.src !== src))

  const uploadImages = async (e) => {
    const files = Array.from(e.target?.files)
    if (files?.length > 0) {
      const data = new FormData()
      files.forEach((file) => data.append("file", file))
      const resData = await (
        await fetch("/api/upload", {
          method: "POST",
          body: data
        })
      ).json()
      setImages((prevImages) => [...prevImages, ...resData])
    }
  }

  const reset = () => {
    setName("")
    setDesc("")
    setPrice("")
    setImages([])
    setCategoryProps([])
    setCategory("")
    setProperties([])
  }

  const submitForm = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setName("")
      setErrMsg("Product Name is Required!")
      return
    }

    if (!desc.trim()) {
      setDesc("")
      setErrMsg("Product Description is Required!")
      return
    }

    if (!price) return setErrMsg("Product Price is Required and Bigger than 0!")

    if (images.length <= 0) return setErrMsg("Product Image is Required!")

    setLoading(true)

    setErrMsg("")

    if (product) {
      await (
        await fetch("/api/products/" + product._id, {
          method: "PUT",
          body: JSON.stringify({
            prevCategory: product.category,
            newProduct: {
              name,
              desc,
              price,
              images,
              category,
              properties
            }
          })
        })
      ).json()

      router.push("/products")
      return
    }

    await (
      await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          desc,
          price,
          images,
          category,
          properties
        })
      })
    ).json()

    reset()
    setIsAdded("Operation Completed Successfully.")
    setLoading(false)
  }

  if (loading) return <Loading />

  return (
    <div className="product">
      <h2>{title}</h2>
      <form onSubmit={(e) => submitForm(e)}>
        {errMsg && (
          <div className="err-message">
            <p>{errMsg}</p>
          </div>
        )}
        {isAdded && (
          <div className="added-message">
            <p>{isAdded}</p>
          </div>
        )}
        <div className="inputs">
          <input
            type="text"
            placeholder="Product Name.."
            value={name}
            onChange={(e) => handleName(e.target.value)}
          />
          <textarea
            placeholder="Product Description.."
            value={desc}
            onChange={(e) => handleDesc(e.target.value)}
          ></textarea>
          <input
            type="number"
            placeholder="Price (USD $)"
            title="Price (USD $)"
            value={price}
            onChange={(e) => handlePrice(e.target.value)}
          />
        </div>
        <div className="images">
          {images.map((img) => (
            <div key={img.src} className="image">
              <span title="Remove" onClick={() => handleImageRemove(img.src)}>
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{ fontSize: 30, color: "var(--del-color)" }}
                />
              </span>
              <img src={img.src} alt={img.name} width={100} height={100} />
            </div>
          ))}
          <div className="upload" title="Upload Images">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
            <span>Upload</span>
            <input type="file" accept="image/*" multiple onChange={(e) => uploadImages(e)} />
          </div>
        </div>
        <div className="options">
          <div className="select">
            <label>Category</label>
            <select value={category} onChange={(e) => handleCategory(e.target.value)}>
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.name} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {categoryProps.map((property, i) => (
            <div key={property.name} className="select">
              <label>{property.name}</label>
              <select
                value={properties[i].value}
                onChange={(e) => handleProps(property.name, e.target.value)}
              >
                <option value="">Unselected</option>
                {property.value.map((val, i) => (
                  <option key={i} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
