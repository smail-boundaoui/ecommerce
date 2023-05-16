import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

export default function Header() {
  const { user } = useSession().data
  return (
    <header className="header">
      <div className="user">
        <div className="image">
          <span>
            <FontAwesomeIcon icon={faUser} style={{ fontSize: 40, color: "#b2b2b2" }} />
          </span>
          <Image src={user.image} alt="profile" width={50} height={50} priority />
        </div>
        <div className="text">
          <h4>{user.name}</h4>
          <span>Admin - Manager</span>
        </div>
      </div>
      <div className="email">{user.email}</div>
      <div className="logout">
        <button onClick={() => signOut()}>
          <span>Logout</span>
          <FontAwesomeIcon icon={faRightFromBracket} style={{ fontSize: 16 }} />
        </button>
      </div>
    </header>
  )
}
