import Image from "next/image"
import Link from "next/link"

export default function Users({ users, handleClick }) {
  return (
    <div className="users">
      <div>
        {users.length <= 0 && <p style={{ textAlign: "center", marginTop: 30 }}>No Users Found!</p>}
        {users.map((user) => (
          <div key={user._id} className="user">
            <div className="profile">
              <div className="image">
                <Image src={user.image} alt={user.name} width={40} height={40} />
              </div>
              <div>
                <h4 className="name">{user.name}</h4>
                <Link href={`mailto:${user.email}`} className="email">
                  {user.email}
                </Link>
              </div>
            </div>
            <div className="date">{new Date(user.date).toUTCString()}</div>
            <div className="control">
              {user.isAdmin ? (
                <div className="admin">Admin</div>
              ) : user.blocked ? (
                <button className="unblock" onClick={() => handleClick(user._id, "unblock")}>
                  Unblock
                </button>
              ) : (
                <>
                  <button className="block" onClick={() => handleClick(user._id, "block")}>
                    Block
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
