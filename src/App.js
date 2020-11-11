import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './hooks/useBookSearch'

function App() {
  const [query, setQuery] = useState()
  const [pageNumber, setPageNumber] = useState()
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber)
  const observer = useRef()
  const lastBookElementRef = useCallback(
    node => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(prev => prev + 1)
        }
      })
      if (node) observer.current.observe(node)
      console.log(node)
    },
    [loading, hasMore]
  )

  const handleSearch = e => {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <div className="app">
      <input
        className="input"
        type="text"
        value={query}
        placeholder="Search here..."
        onChange={handleSearch}
      />
      <ul className="list">
        {books.map((book, index) =>
          books.length === index + 1 ? (
            <li className="book" ref={lastBookElementRef} key={book}>
              {book}
            </li>
          ) : (
            <li className="book" key={book}>
              {book}
            </li>
          )
        )}
      </ul>
      <i className="material-icons loading">{loading && 'cached'}</i>
      <i className="material-icons error">{error && 'report'}</i>
    </div>
  )
}

export default App
