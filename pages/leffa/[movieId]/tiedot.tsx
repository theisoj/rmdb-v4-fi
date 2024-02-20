import {
  movieUrl,
  creditsUrl,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE,
} from "../../../config"
// Basic fetch
import { basicFetch } from "../../../api/fetchFunctions"

// Komponentit
import Header from "../../../components/Header/Header"
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb"
import MovieInfo from "../../../components/MovieInfo/MovieInfo"
import Grid from "../../../components/Grid/Grid"
import Card from "../../../components/Card/Card"

// Tyypit
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import type { Movie, Credits, Crew, Cast } from "../../../api/types"
import Head from "next/head"
import { formatDate } from "../../../helpers"

type Props = {
  movie: Movie
  directors: Crew[]
  cast: Cast[]
}

const Movie: NextPage<Props> = ({ movie, cast, directors }) => (
  <main>
    <Head>
      <title>{movie.title} - RMDB v4</title>
    </Head>
    <Header />
    <Breadcrumb title={movie.title} />
    <MovieInfo
      thumbUrl={
        movie.poster_path
          ? IMAGE_BASE_URL + POSTER_SIZE + movie.poster_path
          : "/no_image.jpg"
      }
      backgroundImgUrl={
        movie.backdrop_path
          ? IMAGE_BASE_URL + BACKDROP_SIZE + movie.backdrop_path
          : "/no_image.jpg"
      }
      rating={movie.vote_average}
      budget={movie.budget}
      title={movie.title}
      year={formatDate(movie.release_date)}
      summary={movie.overview}
      directors={directors}
      time={movie.runtime}
      revenue={movie.revenue}
    />
    <Grid className="p-4 max-w-7xl m-auto" title="Näyttelijät">
      {cast.map((actor) => (
        <Card
          key={actor.credit_id}
          imgUrl={
            actor.profile_path
              ? IMAGE_BASE_URL + POSTER_SIZE + actor.profile_path
              : "/no_image.jpg"
          }
          title={actor.name}
          subtitle={actor.character}
        />
      ))}
    </Grid>
  </main>
)
export default Movie

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const movieId = context.params?.movieId as string

  const movieEndpoint: string = movieUrl(movieId)
  const creditsEndpoint: string = creditsUrl(movieId)

  const movie = await basicFetch<Movie>(movieEndpoint)
  const credits = await basicFetch<Credits>(creditsEndpoint)

  const directors = credits.crew.filter((member) => member.job === "Director")

  return {
    props: {
      movie,
      directors,
      cast: credits.cast,
    },
    revalidate: 60 * 60 * 24,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}
