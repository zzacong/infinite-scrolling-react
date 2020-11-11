import { useEffect, useState } from 'react'
import axios from 'axios'

function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setBooks([])
  }, [query])

  useEffect(() => {
    let cancel

    const fetchData = async () => {
      setLoading(true)
      setError(false)
      try {
        const {
          data: { docs },
        } = await axios.get('https://openlibrary.org/search.json', {
          params: { q: query, page: pageNumber },
          cancelToken: new axios.CancelToken(c => (cancel = c)),
        })
        setBooks(prevBooks => {
          return [...new Set([...prevBooks, ...docs.map(book => book.title)])]
        })
        setHasMore(docs.length > 0)
        setLoading(false)
      } catch (error) {
        if (axios.isCancel(error)) return
        setError(true)
      }
    }
    fetchData()

    return () => cancel()
  }, [query, pageNumber])

  return { loading, error, books, hasMore }
}

export default useBookSearch
