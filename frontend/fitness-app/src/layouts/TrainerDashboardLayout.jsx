import React from "react";
import Navigation from "../components/Navigation";
import TrainerDashboardSidebar from "../components/TrainerDashboard/Sidebar";
import { motion } from "framer-motion";

const TrainerDashboardLayout = ({ children, activeSection }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        background: "linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)",
      }}
    >
      <Navigation />
      <div className="container mx-auto flex relative">
        {/* Left Sidebar */}
        <div className="fixed top-24 left-0 bottom-0 w-[240px] z-10 overflow-hidden">
          <TrainerDashboardSidebar activeSection={activeSection} name="Nipuna Lakruwan" />
        </div>
        {/* Main Content */}
        <motion.div
          className="flex-grow ml-[240px] px-4 pt-6 pb-10 max-w-[calc(100%-240px)] mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default TrainerDashboardLayout;
