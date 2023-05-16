import Link from "next/link"
import Image from "next/image"
import Loading from "./Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"

export default function ProductsList({ products, loading }) {
  if (loading) return <Loading />
  return (
    <div className="products-container">
      {products.length <= 0 && <p style={{ textAlign: "center" }}>No Products Found!</p>}
      {products.map((product) => {
        return (
          <div key={product._id} className="prod">
            <div className="head">
              <div className="img">
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].name}
                  width={40}
                  height={40}
                />
              </div>
              <h3>{product.name}</h3>
            </div>

            <div className="price">$ {product.price}</div>

            <div className="control">
              <Link href={`/products/edit/${product._id}`}>
                <FontAwesomeIcon icon={faPenToSquare} />
                Edit
              </Link>
              <Link href={`/products/delete/${product._id}`}>
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
