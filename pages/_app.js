import Head from "next/head"

// Next-Auth
import { SessionProvider } from "next-auth/react"

// CSS
import "../styles/normalize.css"
import "../styles/globals.css"
import "../styles//layout/layout.css"
import "../styles/layout/Header.css"
import "../styles/layout/navigation.css"
import "../styles/categories/categories.css"
import "../styles/categories/categorie.css"
import "../styles/products/products.css"
import "../styles/products/product.css"
import "../styles/users.css"
import "../styles/admins.css"
import "../styles/components/filter.css"
import "../styles/components/cards.css"

// Font Awesome
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
config.autoAddCss = false

// APP
export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="E-Commerce Online Shop with NextJS & MongoDB" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>Shop Online - Admin</title>
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}
