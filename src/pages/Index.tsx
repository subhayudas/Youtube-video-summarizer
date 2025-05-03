import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import { ReactFlowProvider } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

import MainLayout from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/layout/HeroSection';
import FeaturesSection from '@/components/layout/FeaturesSection';
import HowItWorksSection from '@/components/layout/HowItWorksSection';
import TestimonialsSection from '@/components/layout/TestimonialsSection';
import StatsSection from '@/components/layout/StatsSection';
import Footer from '@/components/layout/Footer';
import AnimatedCard from '@/components/ui/animated-card';
import ApiKeyConfiguration from '@/components/ApiKeyConfig';
import VideoForm from '@/components/VideoForm';
import VideoSummary from '@/components/VideoSummary';
import MindMap from '@/components/MindMap';
import SavedSummaries from '@/components/SavedSummaries';

import { fetchVideoDetails, generateSummary, getApiKey, testApiConnection } from '@/lib/api-service';
import { SummaryResult, YouTubeVideoInfo } from '@/lib/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [activeMainTab, setActiveMainTab] = useState<string>("generate");
  const [hasValidConfig, setHasValidConfig] = useState<boolean>(false);
  const [showApiConfig, setShowApiConfig] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoInfo, setVideoInfo] = useState<YouTubeVideoInfo | null>(null);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  
  useEffect(() => {
    const apiConfig = getApiKey();
    const isValid = !!apiConfig;
    setHasValidConfig(isValid);
    setShowApiConfig(!isValid); // Show if not valid on load
  }, []);

  const handleConfigChange = (isValid: boolean) => {
    setHasValidConfig(isValid);
    // Don't automatically hide here anymore - let user toggle manually
    // if (isValid) {
    //   setShowApiConfig(false);
    // }
    // If config becomes invalid (e.g., key removed), ensure the form is shown
    if (!isValid) {
        setShowApiConfig(true);
    }
  };

  const handleVideoSubmit = async (videoId: string) => {
    const apiConfig = getApiKey();
    
    if (!apiConfig || !hasValidConfig) { // Check hasValidConfig directly
      toast.error("Please configure and save a valid API key first");
      setShowApiConfig(true); 
      
      // Test connection again if config exists but validation state is false
      if(apiConfig && !hasValidConfig) {
          const isValid = await testApiConnection(apiConfig);
          if (!isValid) {
               toast.error("API key connection failed. Please check your key.");
          } 
          setHasValidConfig(isValid);
      }
      return;
    }
    
    setIsLoading(true);
    setVideoInfo(null);
    setSummary(null);
    
    try {
      const details = await fetchVideoDetails(videoId);
      setVideoInfo(details);
      const summaryResult = await generateSummary(videoId, apiConfig);
      setSummary(summaryResult);
      toast.success("Summary generated successfully!");
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to process video'}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <HeroSection />
      
      <div id="features">
        <FeaturesSection />
      </div>
      
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      
      <div id="stats">
        <StatsSection />
      </div>
      
      <div id="try-it-now" className="container mx-auto py-16 px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Try It Now</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI video summarization
          </p>
        </motion.div>
        
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generate">Generate Summary</TabsTrigger>
            <TabsTrigger value="saved">Saved Summaries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <AnimatePresence mode="wait">
                {/* Video URL Section - Conditional */} 
                {hasValidConfig && ( 
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatedCard className="h-full" delay={0.2}>
                      <h2 className="text-xl font-semibold mb-4">Video URL</h2>
                      <VideoForm onVideoSubmit={handleVideoSubmit} isLoading={isLoading} />
                      
                      {isLoading && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-center items-center p-8"
                        >
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="ml-2">Processing video...</span>
                        </motion.div>
                      )}
                    </AnimatedCard>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatedCard delay={0.4}>
                <div className="space-y-4">
                  {/* API Config Header + Toggle */} 
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">API Configuration</h2>
                    {hasValidConfig && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowApiConfig(!showApiConfig)} 
                        aria-label="Toggle API Configuration"
                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                      >
                        <Settings className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                  {/* Conditionally render the ApiKeyConfiguration component */} 
                  <AnimatePresence mode="wait">
                    {(showApiConfig || !hasValidConfig) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ApiKeyConfiguration onConfigChange={handleConfigChange} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedCard>
            </div>
            
            <Separator />
            
            {/* Results Section - Conditional on Summary & Video Info */} 
            <AnimatePresence mode="wait">
              {summary && videoInfo && hasValidConfig && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatedCard delay={0.6}>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList>
                        <TabsTrigger value="summary">Text Summary</TabsTrigger>
                        <TabsTrigger value="mindmap">Mind Map</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="summary">
                        <VideoSummary videoInfo={videoInfo} summary={summary} />
                      </TabsContent>
                      
                      <TabsContent value="mindmap">
                        <ReactFlowProvider>
                          <MindMap summary={summary} />
                        </ReactFlowProvider>
                      </TabsContent>
                    </Tabs>
                  </AnimatedCard>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
          
          <TabsContent value="saved">
            <SavedSummaries />
          </TabsContent>
        </Tabs>
      </div>
      
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      
      <Footer />
    </MainLayout>
  );
};

export default Index;
