import React, { useEffect } from 'react'
import Link from 'next/link'

type Props = {
    results: { id: number; name: string; address: string; logo_image: string; access: string }[]
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function SearchResultsComponent({ results, currentPage, totalPages, onPageChange }: Props) {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    totalPages = Math.max(totalPages, 1);

    return (
        <>
            <ul className="space-y-2">
                {(results || []).map((r) => {
                    const access = r.access; // Directly extract access from shop object
                    return (
                        <li key={r.id} className="border p-4 rounded shadow-sm flex items-start gap-4">
                            <div className="relative w-32 h-24 bg-gray-100 overflow-hidden rounded">
                                {!r.logo_image ? (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                        画像なし
                                    </div>
                                ) : (
                                    <img
                                        src={r.logo_image}
                                        alt={r.name}
                                        className="absolute inset-0 w-full h-full object-contain m-auto"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>
                            <div>
                                <div className="font-semibold">
                                    <Link href={`/detail/${r.id}`} className="hover:underline hover:text-blue-600">
                                        {r.name}
                                    </Link>
                                </div>
                                <div className="text-sm text-gray-600 mt-5">住所：{r.address}</div>
                                <div className="text-sm text-gray-600 mt-1">アクセス：{access}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {results.length > 0 && (
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded"
                    >
                        前へ
                    </button>
                    <span>{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded"
                    >
                        次へ
                    </button>
                </div>
            )}
        </>
    )
}