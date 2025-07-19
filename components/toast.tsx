"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

// Global toast state
let toastQueue: ToastProps[] = [];
let isShowingToast = false;

const ToastComponent: React.FC<ToastProps & { onRemove: () => void }> = ({
  message,
  type = "success",
  duration = 4000,
  onRemove,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-hide after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onRemove, 300); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onRemove]);

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-100";
      case "error":
        return "bg-red-100";
      default:
        return "bg-blue-100";
    }
  };

  return (
    <div
      className={`fixed top-21 md:top-28 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`${getBackgroundColor()} p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[500px] mx-4`}
      >
        <span className="text-[#444444] text-sm flex-1">
          {message}
        </span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onRemove, 300);
          }}
          className="text-[#444444] hover:text-[#444444] transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Toast container
const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const showToast = (props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...props, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Global function to show toast
  if (typeof window !== "undefined") {
    (window as any).showCustomToast = showToast;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          {...toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Simple toast function
export const CustomToast = (props: ToastProps) => {
  if (typeof window !== "undefined" && (window as any).showCustomToast) {
    (window as any).showCustomToast(props);
  }
};

// Export the container
export const ToastContainerComponent = ToastContainer;

// Helper functions
export const toast = {
  success: (message: string, duration?: number) =>
    CustomToast({ message, type: "success", duration }),
  error: (message: string, duration?: number) =>
    CustomToast({ message, type: "error", duration }),
  info: (message: string, duration?: number) =>
    CustomToast({ message, type: "info", duration }),
};
