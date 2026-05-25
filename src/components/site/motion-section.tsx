"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MotionSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("py-16 md:py-24", className)}
    >
      {children}
    </motion.section>
  );
}
