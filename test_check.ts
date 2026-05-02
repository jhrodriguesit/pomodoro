import type { GenreKey } from './src/types'
import { GENRES, GENRE_ORDER } from './src/constants'

// This will show us what TypeScript infers for GENRES[GenreKey]
type GenresValueType = typeof GENRES[GenreKey]

// This will show us the type of GENRE_ORDER
type GenreOrderType = typeof GENRE_ORDER

// Verify that selectedGenre access works
const testAccess = (genre: GenreKey) => {
  return GENRES[genre].label
}

export { testAccess }
