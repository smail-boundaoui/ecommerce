import { useState } from "react"
import { useRouter } from "next/router"
import Layout from "./Layout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"

export default function Categories({ categorie, title = "Create" }) {
  const id = categorie?._id
  const [name, setName] = useState(categorie?.name || "")
  const [nameErr, setNameErr] = useState(false)
  const [properties, setProperties] = useState(
    categorie
      ? categorie.props.map((p) => {
          return { name: p.name, value: p.value.join(","), nameErr: false, valueErr: false }
        })
      : [] || []
  )
  const router = useRouter()

  const addProp = () =>
    setProperties((prevProperties) => [
      ...prevProperties,
      { name: "", value: "", nameErr: false, valueErr: false }
    ])

  const removeProp = (index) =>
    setProperties((prevProperties) => [...prevProperties].filter((current, i) => i !== index))

  const handleChange = (index, prop, value) => {
    setProperties((prevProperties) => {
      const newProps = [...prevProperties]
      newProps[index][prop] = value
      return newProps
    })
  }

  const handleFocus = (index, prop) => {
    setProperties((prevProperties) => {
      const newProps = [...prevProperties]
      newProps[index][prop] = false
      return newProps
    })
  }

  const sendData = async () => {
    if (name.length <= 0) return setNameErr(true)

    const categoryProps = [...properties]

    let categoryPropsErr = false

    mainLoop: for (let i = 0; i < categoryProps.length; i++) {
      const current = categoryProps[i]

      if (current.value.length <= 0) {
        current.valueErr = true
        categoryPropsErr = true
      }

      if (current.name.length <= 0) {
        current.nameErr = true
        categoryPropsErr = true
        continue
      }

      nestedLoop: for (let j = i - 1; j >= 0; j--) {
        const current2 = categoryProps[j]
        if (current.name === current2.name) {
          current.nameErr = true
          categoryPropsErr = true
          break nestedLoop
        }
      }
    }

    if (categoryPropsErr) {
      setProperties(categoryProps)
      return
    }

    const result = await (
      await fetch(`/api/categories/${id ? id : ""}`, {
        method: "POST",
        body: JSON.stringify([name, categoryProps])
      })
    ).json()

    if (result === "exist") return setNameErr(true)

    router.push("/categories")
  }

  return (
    <Layout>
      <div className="add-cat">
        <h2>{title} a Category</h2>
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <div className="head">
            <input
              className={nameErr ? "inputErr" : ""}
              type="text"
              placeholder="name"
              name="name"
              value={name}
              onFocus={() => setNameErr(false)}
              onChange={(e) => setName(e.target.value.trim())}
            />
            <button onClick={sendData}>Save</button>
          </div>
          <div className="props">
            <button onClick={addProp}>Add a Property</button>
            {properties.map((current, index) => (
              <div key={index} className="prop">
                <input
                  className={current.nameErr ? "inputErr" : ""}
                  type="text"
                  placeholder="Property name"
                  value={current.name}
                  onFocus={(e) => handleFocus(index, "nameErr")}
                  onChange={(e) => handleChange(index, "name", e.target.value.trim())}
                />
                <input
                  className={current.valueErr ? "inputErr" : ""}
                  type="text"
                  placeholder="value1, value2, value3, ..."
                  value={current.value}
                  onFocus={(e) => handleFocus(index, "valueErr")}
                  onChange={(e) => handleChange(index, "value", e.target.value.trim())}
                />
                <span title="Remove" onClick={(e) => removeProp(index)}>
                  <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: 15, color: "#fff" }} />
                </span>
              </div>
            ))}
          </div>
        </form>
      </div>
    </Layout>
  )
}
