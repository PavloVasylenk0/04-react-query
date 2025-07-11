import { useState, useEffect, useRef } from "react";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import styles from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isPending, isError, isSuccess } = useQuery<
    Awaited<ReturnType<typeof fetchMovies>>,
    Error,
    Awaited<ReturnType<typeof fetchMovies>>,
    [string, string, number]
  >({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prevData) => prevData,
  });

  const hasShownNoResultsToast = useRef(false);
  useEffect(() => {
    hasShownNoResultsToast.current = false;
  }, [query]);

  useEffect(() => {
    if (
      isSuccess &&
      data &&
      data.results.length === 0 &&
      query &&
      !hasShownNoResultsToast.current
    ) {
      toast.error("No movies found for your request");
      hasShownNoResultsToast.current = true;
    } else if (data && data.results.length > 0) {
      hasShownNoResultsToast.current = false;
    }
  }, [data, query, isSuccess]);

  const hasShownErrorToast = useRef(false);
  useEffect(() => {
    if (isError && query && !hasShownErrorToast.current) {
      toast.error("Failed to fetch movies");
      hasShownErrorToast.current = true;
    } else if (!isError) {
      hasShownErrorToast.current = false;
    }
  }, [isError, query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.container}>
      <SearchBar onSubmit={handleSearch} />

      {isPending && query && <Loader />}
      {isError && query && <ErrorMessage />}

      {isSuccess && data?.results && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />

          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}

      <Toaster />
    </div>
  );
}
