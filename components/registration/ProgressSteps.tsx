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
    <div className="relative pt-2 pb-16 md:pb-12">
      {/* Progress Bar */}
      <div className="absolute top-7 left-5 right-5 md:left-0 md:right-0 h-0.5 bg-gray-700">
        <motion.div
          className="absolute top-0 left-0 h-full bg-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Steps */}
      <div className="relative z-10 flex justify-between px-2 md:px-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = index < currentStep;

          return (
            <div
              key={step}
              className={cn(
                "flex flex-col items-center relative",
                isClickable && "cursor-pointer"
              )}
              onClick={() => isClickable && onStepClick?.(index)}
            >
              {/* Step Circle */}
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
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center",
                  "border-4 border-gray-900 transition-colors",
                  isClickable && "hover:brightness-110"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                ) : (
                  <span className="text-xs md:text-sm font-medium text-white">
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Step Label */}
              <span
                className={cn(
                  "absolute top-12 left-1/2 -translate-x-1/2",
                  "text-[10px] md:text-sm font-medium text-gray-400",
                  "w-24 md:w-32 text-center",
                  "leading-tight"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
