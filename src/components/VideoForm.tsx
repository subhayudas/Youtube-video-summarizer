import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { YoutubeIcon, ArrowRight } from 'lucide-react';
import { extractVideoId } from '@/lib/api-service';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface VideoFormProps {
  onVideoSubmit: (videoId: string) => void;
  isLoading: boolean;
}

const VideoForm: React.FC<VideoFormProps> = ({ onVideoSubmit, isLoading }) => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl.trim()) {
      toast.error('Please enter a YouTube video URL');
      return;
    }
    
    const videoId = extractVideoId(videoUrl);
    
    if (!videoId) {
      toast.error('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      return;
    }
    
    onVideoSubmit(videoId);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="bg-muted/50 rounded-xl border overflow-hidden">
            <div className="flex items-center">
              <YoutubeIcon className="h-5 w-5 text-primary ml-4" />
              <Input
                type="text"
                placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-foreground/10 rounded-[14px] border p-0.5">
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className={cn(
              "rounded-xl px-5 text-base w-full sm:w-auto",
              isLoading && "opacity-70"
            )}
          >
            <span className="mr-2">{isLoading ? 'Processing...' : 'Summarize'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default VideoForm;
