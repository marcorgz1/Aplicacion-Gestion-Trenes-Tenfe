import { useEffect, useState } from 'react';
import { MyTrips } from './MyTrips';
import { SearchTrips } from './SearchTrips';
import { BlogSummary } from './BlogSummary';

export function Home() {
  const [userAuthenticated, setUserAuthenticated] = useState(false)

  useEffect(() => {
    // Obtener token del usuario del local storage
    const userToken = window.localStorage.getItem('token')

    if (userToken) setUserAuthenticated(true)
  }, [])

  return (
    userAuthenticated ? (
      <main className='flex flex-col justify-center items-center min-h-screen'>
        <SearchTrips />
        <MyTrips />
        <BlogSummary />
      </main>
    ) : (
      <main className='flex flex-col justify-center items-center mb-24'>
        <SearchTrips />
        <BlogSummary />
      </main>
    )
  )
}
