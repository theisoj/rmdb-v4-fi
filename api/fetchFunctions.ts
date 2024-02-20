import { Movies } from "./types"

export const basicFetch = async <returnType>(
  endpoint: string
): Promise<returnType> => {
  const response = await fetch(endpoint)

  if (!response.ok) throw new Error("VIRHE!!!")

  const data = await response.json()

  return data
}

export const fetchMovies = async (search = "", page = 1): Promise<Movies> => {
  return await basicFetch<Movies>(`/api/v1/movies?search=${search}&page=${page}`)
}
