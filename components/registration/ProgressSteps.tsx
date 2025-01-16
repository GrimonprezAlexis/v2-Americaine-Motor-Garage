"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function ProgressSteps({
  steps,
  currentStep,
  onStepClick,
}: ProgressStepsProps) {
  return (
    <div className="relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700">
        <motion.div
          className="absolute top-0 left-0 h-full bg-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = index < currentStep;

          return (
            <div
              key={step}
              className="flex flex-col items-center"
              onClick={() => isClickable && onStepClick?.(index)}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted
                    ? "#3b82f6"
                    : isCurrent
                    ? "#1e40af"
                    : "#374151",
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "border-4 border-gray-900 transition-colors",
                  isClickable && "cursor-pointer hover:brightness-110"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-sm font-medium text-white">
                    {index + 1}
                  </span>
                )}
              </motion.div>
              <span className="mt-2 text-sm font-medium text-gray-400 absolute -bottom-6 transform -translate-x-1/2 whitespace-nowrap">
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
