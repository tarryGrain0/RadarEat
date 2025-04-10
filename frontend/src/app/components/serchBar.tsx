'use client";'

import React from "react";

export default function SearchBar() {
  return (
    <div className="w-full sm:w-96 flex flex-col sm:flex-row gap-4 shadow-rounded shadow-lg">
      <input
        type="text"
        placeholder="例：ラーメン、カレー、500m以内"
        className="w-full px-4 py-2 border rounded-md"
      />
      <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-10 transition">
        検索
      </button>
    </div>
  );
}