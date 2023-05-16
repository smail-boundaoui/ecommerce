import { useEffect, useState } from "react"
import Layout from "../Components/Layout"
import Cards from "../Components/Cards"
import Chart from "../Components/Chart"
import {
  faBagShopping,
  faUsers,
  faCartShopping,
  faUserGear,
  faClipboardList
} from "@fortawesome/free-solid-svg-icons"

const ICONS = [
  { icon: faBagShopping, color: "#ee7d3d" },
  { icon: faClipboardList, color: "#9b54e1" },
  { icon: faCartShopping, color: "#29b170" },
  { icon: faUsers, color: "#f64444" },
  { icon: faUserGear, color: "#347ae2" }
]

export default function Dashboard() {
  const [cards, setCards] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setCategories(await (await fetch("/api/categories")).json())
    setCards(await (await fetch("/api/dashboard")).json())
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout>
      <Cards loading={loading} cards={cards} cardsCount={5} icons={ICONS} />
      <Chart data={categories} />
    </Layout>
  )
}
