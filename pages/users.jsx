import { useEffect, useState } from "react"
import Layout from "../Components/Layout"
import Loading from "../Components/Loading"
import UsersList from "../Components/Users"
import Filter from "../Components/Filter"

export default function Users() {
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState("")
  const [blocked, setBlocked] = useState("all")
  const [loading, setLoading] = useState(true)
  const EMAIL_REGEX = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  )

  const fetchUsers = async () => {
    setUsers(await (await fetch("/api/users")).json())
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleClick = async (_id, action) => {
    const result = await (
      await fetch("/api/users", { method: "PUT", body: JSON.stringify({ _id, action }) })
    ).json()
    if (result?._id)
      setUsers((prevUsers) => prevUsers.map((user) => (user._id === result._id ? result : user)))
  }

  const fetchData = async (d1, d2) =>
    setUsers(
      await (
        await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify({ email: d1, blocked: d2 })
        })
      ).json()
    )

  const handleEmailChange = async (value) => {
    setEmail(value)
    if (EMAIL_REGEX.test(value)) fetchData(value, blocked)
  }

  const handleBlockedChange = async (value) => {
    setBlocked(value)
    setEmail("")
    fetchData("", value)
  }

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    )

  return (
    <Layout>
      <div className="users-container">
        <Filter
          inputValue={email}
          inputPlaceHolder={"Full user email..(name@domain.com)"}
          handleInputValue={handleEmailChange}
          selectValue={blocked}
          handleSelectValue={handleBlockedChange}
          selectArray={[]}
          selectLabel="Status"
          extraSelectOptions={
            <>
              <option value="all">All</option>
              <option value="blocked">Blocked Users</option>
              <option value="unBlocked">Unblocked Users</option>
              <option value="admins">Admins</option>
            </>
          }
        />
      </div>
      <UsersList users={users} handleClick={handleClick} />
    </Layout>
  )
}
