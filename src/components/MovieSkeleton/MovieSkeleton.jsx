import React from 'react';

const MovieSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col animate-pulse">
            {/* Poster Skeleton */}
            <div className="relative w-full h-[500px] lg:h-80 bg-gray-300" />

            {/* Text Skeleton */}
            <div className="flex flex-col justify-between flex-1 p-4">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>

                <div className="mt-4 h-10 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
};

export default MovieSkeleton;
