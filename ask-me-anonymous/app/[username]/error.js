'use client' // Error boundaries must be Client Components

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div>
            <h2>User does not exist!</h2>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => redirect("/")
                }
            >
                Home
            </button>
        </div>
    )
}