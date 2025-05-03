import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ExternalLink, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { QAResponse } from '@/lib/types';
import { answerVideoQuestion } from '@/lib/api-service';
import { ApiKeyConfig } from '@/lib/types';

interface VideoQAProps {
  videoId: string;
  apiConfig: ApiKeyConfig | null;
}

// Helper function to format seconds into YouTube's t=... format
const formatTimestampForLink = (seconds: number): string => {
  const roundedSeconds = Math.max(0, Math.floor(seconds));
  if (roundedSeconds < 60) {
    return `${roundedSeconds}s`;
  } else {
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;
    return remainingSeconds > 0 ? `${minutes}m${remainingSeconds}s` : `${minutes}m`;
  }
};

// Helper to display timestamp in M:SS format
const formatTimestampDisplay = (seconds: number): string => {
  const roundedSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(roundedSeconds / 60);
  const secs = roundedSeconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Get confidence level text and color
const getConfidenceLevel = (confidence: number): { text: string; color: string } => {
  if (confidence >= 0.8) {
    return { text: 'High', color: 'bg-green-500' };
  } else if (confidence >= 0.5) {
    return { text: 'Medium', color: 'bg-yellow-500' };
  } else {
    return { text: 'Low', color: 'bg-red-500' };
  }
};

const VideoQA: React.FC<VideoQAProps> = ({ videoId, apiConfig }) => {
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<QAResponse | null>(null);
  const [previousQuestions, setPreviousQuestions] = useState<{ question: string; answer: QAResponse }[]>([]);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (!apiConfig) {
      toast.error('Please configure a valid API key first');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await answerVideoQuestion(question, videoId, apiConfig);
      setAnswer(response);
      setPreviousQuestions([...previousQuestions, { question, answer: response }]);
      setQuestion(''); // Clear the input field
      toast.success('Answer generated successfully!');
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to generate answer'}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Ask About This Video
          </CardTitle>
          <CardDescription>
            Ask any question about the video content and get AI-powered answers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="What is the main point of this video?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !question.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  'Ask'
                )}
              </Button>
            </div>
          </form>

          {isLoading && (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Generating answer...</span>
            </div>
          )}

          {answer && !isLoading && (
            <div className="mt-6 space-y-4 animate-fade-in">
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{previousQuestions[previousQuestions.length - 1]?.question}</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <Badge variant="outline" className={`${getConfidenceLevel(answer.confidence).color} text-white`}>
                      {getConfidenceLevel(answer.confidence).text}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm mb-4">{answer.answer}</p>
                
                {answer.relatedTopics && answer.relatedTopics.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Related Topics:</h4>
                    <div className="flex flex-wrap gap-1">
                      {answer.relatedTopics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {answer.sources && answer.sources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Sources:</h4>
                    <div className="space-y-2">
                      {answer.sources.map((source, index) => (
                        <div key={index} className="text-xs bg-background p-2 rounded border">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">From video at:</span>
                            <a 
                              href={`https://www.youtube.com/watch?v=${videoId}&t=${formatTimestampForLink(source.timestamp)}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-primary hover:underline"
                            >
                              {formatTimestampDisplay(source.timestamp)}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                          <p className="italic">"{source.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {previousQuestions.length > 1 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Previous Questions</h3>
              <div className="space-y-2">
                {previousQuestions.slice(0, -1).reverse().map((item, index) => (
                  <div key={index} className="bg-muted/50 p-3 rounded-md">
                    <h4 className="font-medium text-sm">{item.question}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.answer.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoQA;
