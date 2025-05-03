import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedGroup } from '@/components/ui/animated-group';

const testimonials = [
  {
    quote: "This tool has completely transformed how I study online courses. I can quickly grasp the key concepts without watching hours of content.",
    author: "Alex Johnson",
    role: "Graduate Student",
    avatar: "AJ"
  },
  {
    quote: "As a content creator, I use this to analyze competitor videos and identify trending topics. The mind map feature is incredibly useful for brainstorming.",
    author: "Sophia Chen",
    role: "YouTube Creator",
    avatar: "SC"
  },
  {
    quote: "I've tried many summarization tools, but this one stands out for its accuracy and organization. The topic structure makes complex videos easy to understand.",
    author: "Michael Rodriguez",
    role: "Research Analyst",
    avatar: "MR"
  },
  {
    quote: "Perfect for my online learning. I can quickly review lecture content before exams without rewatching everything. Saves me hours every week!",
    author: "Priya Patel",
    role: "Computer Science Student",
    avatar: "PP"
  },
  {
    quote: "The AI does an amazing job capturing the essence of technical talks. I use it for all the conference videos I need to keep up with in my field.",
    author: "David Kim",
    role: "Software Engineer",
    avatar: "DK"
  },
  {
    quote: "This tool helps me stay on top of industry trends by summarizing long webinars and presentations. The saved summaries feature is a game-changer.",
    author: "Emma Wilson",
    role: "Marketing Director",
    avatar: "EW"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      </div>
      
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
          <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students, researchers, and professionals who are saving time with our AI video summarizer
          </p>
        </AnimatedGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full border shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 text-primary">
                    <Quote className="h-10 w-10 opacity-50" />
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500" fill="currentColor" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 flex-grow italic">"{testimonial.quote}"</p>
                  
                  <div className="flex items-center mt-auto">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.avatar}`} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
