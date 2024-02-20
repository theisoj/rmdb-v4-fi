// Tyypit
import type { NextPage } from "next"

// Komponentit
import Head from "next/head"
import Header from "../components/Header/Header"

const Error: NextPage = () => (
  <>
    <Head>
      <title>Virhe! - RMDB v4</title>
    </Head>
    <Header />
    <div className="flex w-full justify-center items-center">
      <h1 className="p-3 text-center text-2xl font-extrabold md:text-md">
        REHELLISESTI SANOTTUNA TÄTÄ SIVUA EI LÖYTYNYT!
      </h1>
    </div>
  </>
)

export default Error
