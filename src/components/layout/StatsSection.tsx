import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, FileText, Users, Video } from 'lucide-react';
import { AnimatedGroup } from '@/components/ui/animated-group';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  duration?: number;
  delay?: number;
  inView: boolean;
}

const stats = [
  {
    icon: <Clock className="h-10 w-10" />,
    endValue: 95,
    label: "Time Saved",
    suffix: "%",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: <Video className="h-10 w-10" />,
    endValue: 10000,
    label: "Videos Processed",
    suffix: "+",
    color: "text-red-500",
    bgColor: "bg-red-500/10"
  },
  {
    icon: <Users className="h-10 w-10" />,
    endValue: 5000,
    label: "Happy Users",
    suffix: "+",
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    icon: <FileText className="h-10 w-10" />,
    endValue: 25000,
    label: "Summaries Created",
    suffix: "+",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  }
];

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, duration = 2, delay = 0, inView }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }
    
    let start = 0;
    const end = Math.min(value, 999999);
    const incrementTime = (duration * 1000) / end;
    const timer = setTimeout(() => {
      const counter = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(counter);
      }, incrementTime);
      
      return () => clearInterval(counter);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [value, duration, delay, inView]);
  
  return (
    <div className="text-center p-6">
      <div className={`${stats.find(s => s.label === label)?.bgColor} ${stats.find(s => s.label === label)?.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="text-4xl font-bold mb-2">
        {count}{stats.find(s => s.label === label)?.suffix}
      </h3>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
};

export function StatsSection() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <section ref={ref} className="py-20 bg-muted/30">
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
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how our AI video summarizer is transforming content consumption
          </p>
        </AnimatedGroup>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatItem
                icon={stat.icon}
                value={stat.endValue}
                label={stat.label}
                delay={index * 0.2}
                inView={inView}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default StatsSection;
