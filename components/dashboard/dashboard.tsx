"use client";
import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Sidebar from "./Sidebar";
import TabContent from "./TabContent";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("experiences");
  const { user, loading } = useAuth();
  const router = useRouter();

  // Parse admin emails (supports comma-separated list)
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim()) || [];

  // Check authentication and admin access
  useEffect(() => {
    if (!loading) {
      // If not logged in, redirect to home
      if (!user) {
        router.push("/");
        return;
      }
      // If logged in but not admin, redirect to home
      if (!adminEmails.includes(user.email)) {
        toast.error("You are not authorized to access this page");
        router.push("/");
        return;
      }
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized if not admin
  if (!user || !adminEmails.includes(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-[1200px] flex bg-gray-50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto xl:px-0 flex w-full">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="bg-white pl-4 flex-1 flex flex-col overflow-hidden">
          <TabContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
