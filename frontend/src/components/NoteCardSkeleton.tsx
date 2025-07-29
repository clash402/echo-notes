'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const NoteCardSkeleton = () => {
  return (
    <Card className="w-full animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between">
          {/* Title skeleton */}
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          {/* Action buttons skeleton */}
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        
        {/* Tags skeleton */}
        <div className="mt-4">
          <div className="flex gap-2">
            <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-14 h-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        
        {/* Transcript skeleton */}
        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mt-1"></div>
        </div>
        
        {/* Summary skeleton */}
        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mt-1"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export const NoteCardSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <NoteCardSkeleton key={index} />
      ))}
    </div>
  );
}; 