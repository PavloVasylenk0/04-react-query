import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(`${BASE_URL}/search/movie`, {
    params: {
      query,
      page,
      include_adult: false,
      language: "en-US",
    },
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  return response.data;
};
