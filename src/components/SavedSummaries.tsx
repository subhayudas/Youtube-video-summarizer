import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Search, Clock, Star, Youtube, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { SummaryResult, YouTubeVideoInfo } from '@/lib/types';

interface SavedSummary {
  id: string;
  date: string;
  videoInfo: YouTubeVideoInfo;
  summary: SummaryResult;
  favorite: boolean;
}

const SavedSummaries: React.FC = () => {
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadSavedSummaries();
  }, []);

  const loadSavedSummaries = () => {
    try {
      const saved = localStorage.getItem('video-summarizer-saved');
      if (saved) {
        setSavedSummaries(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved summaries:', error);
      toast.error('Failed to load saved summaries');
    }
  };

  const deleteSummary = (id: string) => {
    try {
      const updated = savedSummaries.filter(summary => summary.id !== id);
      setSavedSummaries(updated);
      localStorage.setItem('video-summarizer-saved', JSON.stringify(updated));
      toast.success('Summary deleted');
    } catch (error) {
      console.error('Error deleting summary:', error);
      toast.error('Failed to delete summary');
    }
  };

  const toggleFavorite = (id: string) => {
    try {
      const updated = savedSummaries.map(summary => 
        summary.id === id 
          ? { ...summary, favorite: !summary.favorite } 
          : summary
      );
      setSavedSummaries(updated);
      localStorage.setItem('video-summarizer-saved', JSON.stringify(updated));
      toast.success(updated.find(s => s.id === id)?.favorite 
        ? 'Added to favorites' 
        : 'Removed from favorites');
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('Failed to update favorite status');
    }
  };

  const filteredSummaries = savedSummaries.filter(summary => {
    const matchesSearch = searchQuery === '' || 
      summary.videoInfo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.summary.tldr.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'favorites') return matchesSearch && summary.favorite;
    return matchesSearch;
  });

  const noSummariesMessage = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Youtube className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No saved summaries yet</h3>
      <p className="text-muted-foreground mb-4">
        Generate and save video summaries to access them here
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Your Saved Summaries</h2>
          <p className="text-muted-foreground">Access your previously generated video summaries</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search summaries..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Summaries</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {filteredSummaries.length === 0 ? noSummariesMessage : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSummaries.map((item, index) => (
                <SummaryCard 
                  key={item.id}
                  summary={item}
                  onDelete={deleteSummary}
                  onToggleFavorite={toggleFavorite}
                  index={index}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-0">
          {filteredSummaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Star className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No favorite summaries</h3>
              <p className="text-muted-foreground mb-4">
                Mark summaries as favorites to find them quickly
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSummaries.map((item, index) => (
                <SummaryCard 
                  key={item.id}
                  summary={item}
                  onDelete={deleteSummary}
                  onToggleFavorite={toggleFavorite}
                  index={index}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SummaryCardProps {
  summary: SavedSummary;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  index: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, onDelete, onToggleFavorite, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg line-clamp-2">{summary.videoInfo.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${summary.favorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
              onClick={() => onToggleFavorite(summary.id)}
            >
              <Star className="h-5 w-5" fill={summary.favorite ? 'currentColor' : 'none'} />
            </Button>
          </div>
          <CardDescription className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(summary.date).toLocaleDateString()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="line-clamp-3 text-sm text-muted-foreground mb-2">
            {summary.summary.tldr}
          </div>
          <div className="text-xs text-muted-foreground">
            {summary.summary.topics.length} topics, {summary.summary.topics.reduce(
              (count, topic) => count + (topic.subtopics?.length || 0), 0
            )} subtopics
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between border-t">
          <Button variant="outline" size="sm" asChild>
            <a href={`https://www.youtube.com/watch?v=${summary.videoInfo.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <Youtube className="h-3.5 w-3.5" />
              <span>Watch</span>
            </a>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`/summary/${summary.id}`} className="flex items-center gap-1">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View</span>
              </a>
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="px-2.5"
              onClick={() => onDelete(summary.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SavedSummaries;
