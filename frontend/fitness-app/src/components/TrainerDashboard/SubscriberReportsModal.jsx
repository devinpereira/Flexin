import React from "react";
import { Line, Bar } from "react-chartjs-2";

const SubscriberReportsModal = ({
  open,
  onClose,
  reportData,
  weightChart,
  bmiChart,
  caloriesChart,
  workoutsChart,
  adherenceChart,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1A1A2F] rounded-2xl shadow-2xl max-w-3xl w-full relative flex flex-col" style={{ height: "92vh" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232342]">
          <span className="text-white font-semibold text-lg">Subscriber Progress Reports</span>
          <button
            className="text-white/70 hover:text-white text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-0 bg-[#121225]">
          <div className="grid grid-cols-1 gap-0 h-full">
            <div className="h-[18vh] border-b border-[#232342] flex flex-col justify-center">
              <h3 className="text-white font-bold mb-1 px-6">Weight Trend</h3>
              <div className="h-full w-full px-6">
                <Line data={weightChart} options={{
                  plugins: { legend: { labels: { color: "#fff" } } },
                  maintainAspectRatio: false,
                  scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } }
                }} height={null} />
              </div>
            </div>
            <div className="h-[18vh] border-b border-[#232342] flex flex-col justify-center">
              <h3 className="text-white font-bold mb-1 px-6">BMI Progress</h3>
              <div className="h-full w-full px-6">
                <Line data={bmiChart} options={{
                  plugins: { legend: { labels: { color: "#fff" } } },
                  maintainAspectRatio: false,
                  scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } }
                }} height={null} />
              </div>
            </div>
            <div className="h-[18vh] border-b border-[#232342] flex flex-col justify-center">
              <h3 className="text-white font-bold mb-1 px-6">Calories Intake</h3>
              <div className="h-full w-full px-6">
                <Line data={caloriesChart} options={{
                  plugins: { legend: { labels: { color: "#fff" } } },
                  maintainAspectRatio: false,
                  scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } }
                }} height={null} />
              </div>
            </div>
            <div className="h-[18vh] border-b border-[#232342] flex flex-col justify-center">
              <h3 className="text-white font-bold mb-1 px-6">Workouts Completed</h3>
              <div className="h-full w-full px-6">
                <Bar data={workoutsChart} options={{
                  plugins: { legend: { labels: { color: "#fff" } } },
                  maintainAspectRatio: false,
                  scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } }
                }} height={null} />
              </div>
            </div>
            <div className="h-[18vh] flex flex-col justify-center">
              <h3 className="text-white font-bold mb-1 px-6">Schedule Adherence</h3>
              <div className="h-full w-full px-6">
                <Line data={adherenceChart} options={{
                  plugins: { legend: { labels: { color: "#fff" } } },
                  maintainAspectRatio: false,
                  scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } }
                }} height={null} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberReportsModal;
