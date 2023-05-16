import Header from "./Header"
import Nav from "./Nav"
import Loading from "./Loading"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Layout(props) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setLoading(true)
    const handleComplete = (url) => url === router.asPath && setLoading(false)
    router.events.on("routeChangeStart", handleStart)
    router.events.on("routeChangeComplete", handleComplete)
    router.events.on("routeChangeError", handleComplete)
  })

  if (status === "loading") return <Loading />

  if (status === "unauthenticated") {
    window.location.replace("/api/auth/signin")
    return
  }

  if (!session.user.isAdmin)
    return (
      <div className="not-admin">
        <p>
          <b>You are not an Admin!</b>
        </p>
        <span>
          <small>Sign in with an admin account</small>
        </span>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    )

  return (
    <div className="layout-container">
      <Nav />
      <div className="main-container">
        <Header />
        <div className="content-container">{loading ? <Loading /> : props.children}</div>
      </div>
    </div>
  )
}
