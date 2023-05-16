import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Loading from "./Loading"

export default function Cards({ loading, cards, cardsCount, icons }) {
  const cardsJSX = []

  if (loading)
    return (
      <div className="global-cards">
        {new Array(cardsCount || 3).fill().map((card, i) => (
          <div key={i} className="card">
            <Loading />
          </div>
        ))}
      </div>
    )

  if (cards) {
    let i = 0
    for (const key in cards) {
      cardsJSX.push(
        <div key={i} className="card" style={{ boxShadow: `0 0 3px ${icons[i].color}` }}>
          <span>
            <FontAwesomeIcon icon={icons[i].icon} style={{ color: icons[i].color, fontSize: 22 }} />
          </span>
          <h3>{cards[key]}</h3>
          <p>Total {key}</p>
        </div>
      )
      ++i
    }
  }

  return <div className="global-cards">{cardsJSX.map((card) => card)}</div>
}
