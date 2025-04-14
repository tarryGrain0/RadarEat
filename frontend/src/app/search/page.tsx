'use client'

import React, { useState, useEffect } from 'react'
import SearchBar, { LocationSearchQuery } from './../components/SearchBarComponent'
import SearchResults from './../components/SearchResultsComponent'

export default function SearchPage() {
    const [results, setResults] = useState<{ id: number; name: string }[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [lastQuery, setLastQuery] = useState<LocationSearchQuery | null>(null)

    const fetchResults = async (query: LocationSearchQuery, page: number) => {
        const res = await fetch('http://localhost:3001/api/restaurant_searches/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: query.latitude,
                longitude: query.longitude,
                range: query.range,
                page,
            }),
        })

        const data = await res.json()
        setResults(data.results)
        setTotalPages(data.totalPages)
    }

    const handleSearch = (query: LocationSearchQuery) => {
        setLastQuery(query)
        setPage(1)
        fetchResults(query, 1)
    }

    useEffect(() => {
        if (lastQuery) {
            fetchResults(lastQuery, page)
        }
    }, [page])

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} />
            <SearchResults
                results={results}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </main>
    )
}