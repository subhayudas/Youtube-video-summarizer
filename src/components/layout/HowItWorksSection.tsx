import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Cpu, FileText, Network, ArrowRight } from 'lucide-react';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { cn } from '@/lib/utils';

const steps = [
  {
    icon: <Youtube className="h-12 w-12" />,
    title: "Paste YouTube URL",
    description: "Simply paste any YouTube video URL into our tool. We support videos of any length and topic.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20"
  },
  {
    icon: <Cpu className="h-12 w-12" />,
    title: "AI Processing",
    description: "Our advanced AI analyzes the video content, extracting key topics, insights, and relationships.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  {
    icon: <FileText className="h-12 w-12" />,
    title: "Generate Summary",
    description: "Receive a structured summary with main topics, subtopics, and key points from the video.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  },
  {
    icon: <Network className="h-12 w-12" />,
    title: "Explore Mind Map",
    description: "Visualize the content with an interactive mind map showing relationships between topics.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Background gradient */}
      <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_0%,transparent_0%,var(--background)_70%)]" />
      
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
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered video summarizer works in four simple steps
          </p>
        </AnimatedGroup>

        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row items-center gap-6 mb-8 relative z-10"
              >
                <div className={cn(
                  "flex items-center justify-center w-24 h-24 rounded-full shrink-0",
                  step.bgColor, step.borderColor, "border-2"
                )}>
                  <div className={step.color}>{step.icon}</div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">{step.description}</p>
                </div>
              </motion.div>
              
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute left-12 top-24 bottom-0 w-0.5 bg-muted z-0">
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-muted">
                    <ArrowRight className="h-6 w-6 rotate-90" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
