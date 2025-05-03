'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SummaryResult, YouTubeVideoInfo } from '@/lib/types';

interface BookmarkButtonProps {
  videoId: string;
  title: string;
  summary?: SummaryResult;
  videoInfo?: YouTubeVideoInfo;
  variant?: "bookmark" | "save";
}

interface BookmarkedVideo {
  id: string;
  title: string;
  timestamp: number;
}

interface SavedSummary {
  id: string;
  date: string;
  videoInfo: YouTubeVideoInfo;
  summary: SummaryResult;
  favorite: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  videoId, 
  title, 
  summary, 
  videoInfo,
  variant = "bookmark" 
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check bookmark status
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedVideos') || '[]');
    setIsBookmarked(bookmarks.some((bookmark: BookmarkedVideo) => bookmark.id === videoId));
    
    // Check saved summary status if applicable
    if (variant === "save" && summary && videoInfo) {
      const savedSummaries = JSON.parse(localStorage.getItem('video-summarizer-saved') || '[]');
      setIsSaved(savedSummaries.some((saved: SavedSummary) => saved.id === videoId));
    }
  }, [videoId, variant, summary, videoInfo]);

  const toggleBookmark = () => {
    const bookmarks: BookmarkedVideo[] = JSON.parse(localStorage.getItem('bookmarkedVideos') || '[]');
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== videoId);
      localStorage.setItem('bookmarkedVideos', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      toast.success('Video removed from bookmarks');
    } else {
      const newBookmark: BookmarkedVideo = {
        id: videoId,
        title,
        timestamp: Date.now()
      };
      const updatedBookmarks = [...bookmarks, newBookmark];
      localStorage.setItem('bookmarkedVideos', JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
      toast.success('Video added to bookmarks');
    }
  };

  const toggleSaveSummary = () => {
    if (!summary || !videoInfo) {
      toast.error('Cannot save: Missing summary or video information');
      return;
    }

    const savedSummaries: SavedSummary[] = JSON.parse(localStorage.getItem('video-summarizer-saved') || '[]');
    
    if (isSaved) {
      const updatedSummaries = savedSummaries.filter(saved => saved.id !== videoId);
      localStorage.setItem('video-summarizer-saved', JSON.stringify(updatedSummaries));
      setIsSaved(false);
      toast.success('Summary removed from saved items');
    } else {
      const newSavedSummary: SavedSummary = {
        id: videoId,
        date: new Date().toISOString(),
        videoInfo,
        summary,
        favorite: false
      };
      const updatedSummaries = [...savedSummaries, newSavedSummary];
      localStorage.setItem('video-summarizer-saved', JSON.stringify(updatedSummaries));
      setIsSaved(true);
      toast.success('Summary saved successfully');
    }
  };

  if (variant === "save") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={toggleSaveSummary}
        title={isSaved ? 'Remove saved summary' : 'Save this summary'}
      >
        {isSaved ? (
          <>
            <BookmarkCheck className="h-4 w-4 text-primary" />
            <span>Saved</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>Save Summary</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full hover:bg-muted"
      onClick={toggleBookmark}
      title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-5 w-5 text-primary" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
    </Button>
  );
};

export default BookmarkButton;