import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  triggerOnce?: boolean;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.5,
  distance = 20,
  className = "",
  triggerOnce = true,
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: triggerOnce, margin: "-50px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Subtle easing
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
