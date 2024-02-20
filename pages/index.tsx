import { UIEvent, useState } from "react"
import type { NextPage } from "next"
import Link from "next/link"
// Hakuhookki
import { useFetchMovies } from "../api/fetchHooks"

// Konfiguraatio
import { IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from "../config"

import Head from "next/head"
import Card from "../components/Card/Card"
import Grid from "../components/Grid/Grid"
// Komponentit
import Header from "../components/Header/Header"
import Hero from "../components/Hero/Hero"
import Spinner from "../components/Spinner/Spinner"

const Home: NextPage = () => {
  const [query, setQuery] = useState("")

  const { data, fetchNextPage, isLoading, isFetching, error } =
    useFetchMovies(query)

  const handleScroll = (e: UIEvent<HTMLElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget

    if (scrollHeight - scrollTop === clientHeight) fetchNextPage()
  }

  if (error)
    return (
      <>
        <Head>
          <title>Virhe! - RMDB v4</title>
        </Head>
        <div className="flex w-full justify-center items-center h-screen">
          <h1 className="p-6 text-center text-2xl font-extrabold md:text-md">
            TIETOJA EI LÖYTYNYT.
          </h1>
        </div>
      </>
    )

  return (
    <main
      onScroll={handleScroll}
      className="relative h-screen overflow-y-scroll"
    >
      <Head>
        <title>Etusivu - RMDB v4</title>
      </Head>
      <Header setQuery={setQuery} />
      {!query && data && data.pages ? (
        <Hero
          imgUrl={
            data.pages[0].results[0].backdrop_path
              ? IMAGE_BASE_URL +
                BACKDROP_SIZE +
                data.pages[0].results[0].backdrop_path
              : "/no_image.jpg"
          }
          title={data.pages[0].results[0].title}
          text={data.pages[0].results[0].overview}
        />
      ) : null}
      <Grid
        className="p-4 max-w-7xl m-auto"
        title={
          query
            ? `Hakutulokset: ${data?.pages[0].total_results}`
            : "Suositut leffat"
        }
      >
        {data && data.pages
          ? data.pages.map((page) =>
              page.results.map((movie) => (
                <Link key={movie.id} href={`/leffa/${movie.id}/tiedot`}>
                  <div className="cursor-pointer hover:opacity-80 duration-300">
                    <Card
                      imgUrl={
                        movie.poster_path
                          ? IMAGE_BASE_URL + POSTER_SIZE + movie.poster_path
                          : "/no_image.jpg"
                      }
                      title={movie.title}
                      subtitle={movie.overview}
                    />
                  </div>
                </Link>
              ))
            )
          : null}
      </Grid>
      {isLoading || isFetching ? <Spinner /> : null}
    </main>
  )
}

export default Home
