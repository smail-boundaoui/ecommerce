import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHouse,
  faGear,
  faUsers,
  faUsersGear,
  faCartShopping,
  faLayerGroup,
  faRectangleList
} from "@fortawesome/free-solid-svg-icons"

export default function Nav() {
  const { pathname } = useRouter()

  const linksObj = {
    dashboard: faHouse,
    products: faRectangleList,
    categories: faLayerGroup,
    orders: faCartShopping,
    users: faUsers,
    admins: faUsersGear,
    settings: faGear
  }

  const links = Object.keys(linksObj).map((link, i) => (
    <li
      key={i}
      className={
        link === "dashboard" && pathname === "/"
          ? "active"
          : pathname.includes(`/${link}`)
          ? "active"
          : ""
      }
    >
      <Link href={`/${link === "dashboard" ? "" : link}`}>
        <FontAwesomeIcon icon={linksObj[link]} style={{ fontSize: 20 }} />
        <span>{link}</span>
      </Link>
    </li>
  ))

  return (
    <nav className="nav">
      <div className="logo">
        <Image src="/logo2.png" alt="logo" width={130} height={121} priority />
      </div>
      <ul className="links">{links}</ul>
    </nav>
  )
}
