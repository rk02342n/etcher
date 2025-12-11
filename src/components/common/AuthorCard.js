import React from "react";

export default function AuthorCard({ authorName }) {
  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-md">
      <h1 className="text-xl font-semibold">{authorName}</h1>
    </div>
  );
}
