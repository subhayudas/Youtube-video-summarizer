import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Brain, Clock, FileText, Network, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedGroup } from '@/components/ui/animated-group';

const features = [
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: "AI-Powered Analysis",
    description: "Advanced AI models analyze video content to extract key insights, topics, and concepts."
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Save Time",
    description: "Get the essence of lengthy videos in minutes, not hours. Perfect for research and learning."
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Structured Summaries",
    description: "Organized summaries with main topics, subtopics, and key points for easy comprehension."
  },
  {
    icon: <Network className="h-10 w-10 text-primary" />,
    title: "Interactive Mind Maps",
    description: "Visualize video content with expandable mind maps showing relationships between topics."
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Instant Access",
    description: "Save summaries to your library for quick reference anytime, even offline."
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Multiple AI Models",
    description: "Choose between different AI providers for varied summarization styles and capabilities."
  }
];

const comparisonItems = [
  { feature: "Time Required", traditional: "Hours", aiSummarizer: "Minutes" },
  { feature: "Comprehensiveness", traditional: "Variable", aiSummarizer: "Consistent" },
  { feature: "Structure", traditional: "Manual Organization", aiSummarizer: "Automatic Hierarchy" },
  { feature: "Visual Aids", traditional: "Separate Creation", aiSummarizer: "Integrated Mind Maps" },
  { feature: "Accessibility", traditional: "Format Dependent", aiSummarizer: "Multi-format Support" },
  { feature: "Searchability", traditional: "Limited", aiSummarizer: "Full Text Search" }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                }
              }
            },
            item: {
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: 'spring',
                  bounce: 0.3,
                  duration: 1,
                }
              }
            }
          }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform how you consume video content with our advanced AI summarization tools
          </p>
        </AnimatedGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full border-none shadow-lg bg-gradient-to-br from-background to-muted hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                }
              }
            },
            item: {
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: 'spring',
                  bounce: 0.3,
                  duration: 1,
                }
              }
            }
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose AI Summarization?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how our AI video summarizer compares to traditional note-taking methods
          </p>
        </AnimatedGroup>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-3 text-center font-semibold border-b">
            <div className="p-4 bg-muted/50">Feature</div>
            <div className="p-4 bg-muted/30">Traditional Method</div>
            <div className="p-4 bg-primary/10">AI Summarizer</div>
          </div>
          
          {comparisonItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`grid grid-cols-3 text-center ${index % 2 === 0 ? 'bg-muted/5' : ''}`}
            >
              <div className="p-4 font-medium border-r">{item.feature}</div>
              <div className="p-4 text-muted-foreground border-r">{item.traditional}</div>
              <div className="p-4 flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>{item.aiSummarizer}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;
