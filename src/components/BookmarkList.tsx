'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface BookmarkedVideo {
  id: string;
  title: string;
  timestamp: number;
}

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedVideo[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadBookmarks = () => {
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedVideos') || '[]');
      setBookmarks(savedBookmarks.sort((a: BookmarkedVideo, b: BookmarkedVideo) => b.timestamp - a.timestamp));
    };

    loadBookmarks();
    window.addEventListener('storage', loadBookmarks);
    return () => window.removeEventListener('storage', loadBookmarks);
  }, []);

  const removeBookmark = (videoId: string) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== videoId);
    localStorage.setItem('bookmarkedVideos', JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
    toast.success('Video removed from bookmarks');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-muted relative"
          title="View bookmarks"
        >
          <Bookmark className="h-5 w-5" />
          {bookmarks.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {bookmarks.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Bookmarked Videos</SheetTitle>
          <SheetDescription>
            Your saved video summaries
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4 pr-4">
          <AnimatePresence mode="popLayout">
            {bookmarks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No bookmarked videos yet
              </div>
            ) : (
              <motion.div
                className="space-y-2"
                layout
              >
                {bookmarks.map((bookmark) => (
                  <motion.div
                    key={bookmark.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <h4 className="font-medium text-sm truncate">{bookmark.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bookmark.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${bookmark.id}`, '_blank')}
                        title="Open video"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => removeBookmark(bookmark.id)}
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default BookmarkList;