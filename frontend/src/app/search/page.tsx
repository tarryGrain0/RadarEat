'use client'

import React, { useState, useEffect, useRef } from 'react'
import SearchBar, { LocationSearchQuery } from './../components/SearchBarComponent'
import SearchResults from './../components/SearchResultsComponent'
import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
    const searchParams = useSearchParams()
    const [results, setResults] = useState<{ id: number; name: string }[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(false);
    const hasRestoredRef = useRef(false);
    const [totalAvailable, setTotalAvailable] = useState(0)

    const fetchResults = async (query: LocationSearchQuery, page: number) => {
        setIsLoading(true);
        setResults([]); // Clear previous results
        const res = await fetch('/api/restaurant_searches/location', {
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
        setTotalAvailable(data.totalAvailable)
        setIsLoading(false);
    }

    const handleSearch = (query: LocationSearchQuery) => {
        const queryString = `?latitude=${query.latitude}&longitude=${query.longitude}&range=${query.range}&page=1`
        window.history.pushState(null, '', `/search${queryString}`)
        setPage(1)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(window.location.search)
        params.set('page', newPage.toString())
        window.scrollTo({ top: 0 })
        window.history.pushState(null, '', `/search?${params.toString()}`)
        setPage(newPage)
    }

    useEffect(() => {
        const latitude = parseFloat(searchParams.get('latitude') || '')
        const longitude = parseFloat(searchParams.get('longitude') || '')
        const range = parseInt(searchParams.get('range') || '3')
        const currentPage = parseInt(searchParams.get('page') || '1')

        if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(range)) {
            setPage(currentPage)
            fetchResults({ latitude, longitude, range }, currentPage)
        }
    }, [searchParams])

    useEffect(() => {
        if (!hasRestoredRef.current && results.length > 0) {
            const savedY = sessionStorage.getItem(`scrollY:${window.location.pathname}`);
            if (savedY) {
                window.scrollTo(0, parseInt(savedY, 10));
                hasRestoredRef.current = true;
            }
        }
    }, [results]);

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} />
            {!isLoading || results.length > 0 ? (
                <SearchResults
                    results={results}
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                    totalAvailable={totalAvailable}
                />
            ) : null}
        </main>
    )
}