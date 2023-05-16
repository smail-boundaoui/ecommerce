import { useEffect, useState } from "react"
import Layout from "../Components/Layout"
import Loading from "../Components/Loading"

export default function Admins() {
  const [admins, setAdmins] = useState([])
  const [email, setEmail] = useState("")
  const [inputErr, setInputErr] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchAdmins = async () => {
    setAdmins(await (await fetch("/api/admins")).json())
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await (
      await fetch("/api/admins", {
        method: "POST",
        body: JSON.stringify({ email })
      })
    ).json()
    if (result.modifiedCount >= 1) {
      setLoading(true)
      setEmail("")
      fetchAdmins()
    } else {
      setInputErr(true)
      setEmail("User Email Not Found!")
    }
  }

  const handleDelete = async (_id) => {
    await (await fetch("/api/admins", { method: "PUT", body: JSON.stringify({ _id }) })).json()
    fetchAdmins()
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  return (
    <Layout>
      <div className="admins-container">
        <h2>Admins</h2>
        <div>
          <div className="add">
            <h3>Add a new Admin</h3>
            <form onSubmit={(e) => handleSubmit(e)}>
              <input
                className={inputErr ? "err" : ""}
                type="email"
                placeholder="User Google Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => {
                  setInputErr(false)
                  inputErr && setEmail("")
                }}
                required
              />
              <button type="submit">Add Admin</button>
            </form>
          </div>
          <div className="admins">
            <h3>Existing Admins</h3>
            <div className="table">
              <div className="head">
                <div className="name">Name</div>
                <div className="email">Google Email</div>
                <div className="date">Signup Date</div>
                <div className="action">Action</div>
              </div>
              <hr />
              <div className="body">
                {loading ? (
                  <Loading />
                ) : admins.length > 0 ? (
                  admins.map((admin) => (
                    <div key={admin._id} className="admin">
                      <div className="name">{admin.name}</div>
                      <div className="email">{admin.email}</div>
                      <div className="date">{new Date(admin.date).toUTCString()}</div>
                      <div className="action">
                        <button onClick={(e) => handleDelete(admin._id)}>Delete</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center", padding: 10 }}>No Admins Found!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
