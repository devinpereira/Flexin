import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/Calculator/CalculatorLayout';
import {
  FaChartLine,
  FaWeight,
  FaFireAlt,
  FaCalendarCheck,
  FaDumbbell,
  FaDownload,
  FaFilter,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa';

// Chart component imports
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    showBMI: true,
    showBMR: true,
    showWorkouts: true,
    showWeight: true
  });

  // Sample historical data - in a real app, this would come from an API/database
  const [userData, setUserData] = useState({
    bmiHistory: [],
    bmrHistory: [],
    workoutHistory: [],
    weightHistory: [],
    scheduleAdherence: {},
    calorieIntake: []
  });

  // Fetch user data
  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Generate sample data based on selected time range
      const daysInRange = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
      const now = new Date();

      // Generate dates for the range
      const dates = Array.from({ length: daysInRange }, (_, i) => {
        const date = new Date();
        date.setDate(now.getDate() - (daysInRange - i - 1));
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      });

      // Sample BMI data with realistic fluctuation
      const bmiData = dates.map(date => {
        // Base BMI with small random fluctuations
        const baseBmi = 23.5;
        const fluctuation = (Math.random() - 0.5) * 0.3; // Small random change
        return {
          date,
          value: parseFloat((baseBmi + fluctuation).toFixed(1)),
          category: getCategoryForBMI(parseFloat((baseBmi + fluctuation).toFixed(1)))
        };
      });

      // Sample BMR data
      const bmrData = dates.map(date => {
        // Base BMR with small random fluctuations
        const baseBmr = 1850;
        const fluctuation = (Math.random() - 0.5) * 30; // Small random change
        return {
          date,
          value: Math.round(baseBmr + fluctuation),
          goal: 2200 // Calorie goal
        };
      });

      // Sample workout data (not every day has a workout)
      const workoutData = dates.filter(() => Math.random() > 0.4).map(date => {
        return {
          date,
          duration: Math.round(30 + Math.random() * 30), // 30-60 minutes
          caloriesBurned: Math.round(200 + Math.random() * 300), // 200-500 calories
          type: ['Strength', 'Cardio', 'HIIT', 'Yoga'][Math.floor(Math.random() * 4)]
        };
      });

      // Weight history
      const weightData = dates.map(date => {
        // Base weight with small random fluctuations
        const baseWeight = 75; // kg
        const fluctuation = (Math.random() - 0.5) * 0.6; // Small random change
        return {
          date,
          value: parseFloat((baseWeight + fluctuation).toFixed(1))
        };
      });

      // Schedule adherence - percent of scheduled workouts completed
      const scheduleData = {
        Monday: { scheduled: 4, completed: 3 },
        Tuesday: { scheduled: 4, completed: 4 },
        Wednesday: { scheduled: 4, completed: 2 },
        Thursday: { scheduled: 4, completed: 3 },
        Friday: { scheduled: 4, completed: 3 },
        Saturday: { scheduled: 4, completed: 2 },
        Sunday: { scheduled: 4, completed: 1 }
      };

      // Calorie intake data
      const calorieData = dates.map(date => {
        return {
          date,
          intake: Math.round(1800 + Math.random() * 500), // 1800-2300 calories
          goal: 2200, // Target calorie intake
          protein: Math.round(100 + Math.random() * 50), // 100-150g protein
          carbs: Math.round(150 + Math.random() * 100), // 150-250g carbs
          fat: Math.round(50 + Math.random() * 30) // 50-80g fat
        };
      });

      // Update state with the generated data
      setUserData({
        bmiHistory: bmiData,
        bmrHistory: bmrData,
        workoutHistory: workoutData,
        weightHistory: weightData,
        scheduleAdherence: scheduleData,
        calorieIntake: calorieData
      });
    }, 800);
  }, [timeRange]);

  // Helper function to get BMI category
  const getCategoryForBMI = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate summary statistics
  const generateSummary = () => {
    if (!userData.bmiHistory.length) return null;

    // Calculate BMI change
    const firstBMI = userData.bmiHistory[0]?.value || 0;
    const lastBMI = userData.bmiHistory[userData.bmiHistory.length - 1]?.value || 0;
    const bmiChange = (lastBMI - firstBMI).toFixed(1);

    // Calculate weight change
    const firstWeight = userData.weightHistory[0]?.value || 0;
    const lastWeight = userData.weightHistory[userData.weightHistory.length - 1]?.value || 0;
    const weightChange = (lastWeight - firstWeight).toFixed(1);

    // Calculate workout stats
    const totalWorkouts = userData.workoutHistory.length;
    const totalDuration = userData.workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);
    const totalCaloriesBurned = userData.workoutHistory.reduce((sum, workout) => sum + workout.caloriesBurned, 0);

    // Calculate average daily calories
    const avgCalories = userData.calorieIntake.reduce((sum, day) => sum + day.intake, 0) / userData.calorieIntake.length;

    return {
      bmiChange,
      weightChange,
      totalWorkouts,
      totalDuration,
      totalCaloriesBurned,
      avgCalories: Math.round(avgCalories)
    };
  };

  const summary = generateSummary();

  // Filter button handler
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Toggle filter options
  const toggleFilterOption = (option) => {
    setFilterOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Handle export reports
  const handleExport = (format) => {
    // In a real app, this would generate and download a report
    alert(`Exporting report in ${format} format`);
  };

  return (
    <CalculatorLayout pageTitle="Fitness Reports">
      {/* Time Range Selection */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-6 flex justify-between items-center p-2">
        <div className="flex">
          <button
            className={`px-4 py-2 ${timeRange === 'week' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1A1A2F]'}`}
            onClick={() => handleTimeRangeChange('week')}
          >
            Week
          </button>
          <button
            className={`px-4 py-2 ${timeRange === 'month' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1A1A2F]'}`}
            onClick={() => handleTimeRangeChange('month')}
          >
            Month
          </button>
          <button
            className={`px-4 py-2 ${timeRange === 'quarter' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1A1A2F]'}`}
            onClick={() => handleTimeRangeChange('quarter')}
          >
            3 Months
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <button
              className="bg-[#1A1A2F] text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1A1A2F]/70"
              onClick={toggleFilter}
            >
              <FaFilter size={14} />
              <span className="hidden sm:inline">Filter</span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 bg-[#1A1A2F] border border-[#f67a45]/30 rounded-lg p-3 shadow-lg z-10 w-48">
                <h4 className="text-white font-medium mb-2 text-sm">Show/Hide</h4>
                <div className="space-y-2">
                  <label className="flex items-center text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterOptions.showBMI}
                      onChange={() => toggleFilterOption('showBMI')}
                      className="mr-2 accent-[#f67a45]"
                    />
                    BMI Data
                  </label>
                  <label className="flex items-center text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterOptions.showBMR}
                      onChange={() => toggleFilterOption('showBMR')}
                      className="mr-2 accent-[#f67a45]"
                    />
                    BMR & Calories
                  </label>
                  <label className="flex items-center text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterOptions.showWorkouts}
                      onChange={() => toggleFilterOption('showWorkouts')}
                      className="mr-2 accent-[#f67a45]"
                    />
                    Workout Data
                  </label>
                  <label className="flex items-center text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterOptions.showWeight}
                      onChange={() => toggleFilterOption('showWeight')}
                      className="mr-2 accent-[#f67a45]"
                    />
                    Weight Tracking
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="relative group">
            <button className="bg-[#1A1A2F] text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1A1A2F]/70">
              <FaDownload size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <div className="absolute right-0 mt-2 bg-[#1A1A2F] border border-[#f67a45]/30 rounded-lg shadow-lg z-10 w-32 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                className="block w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/20 rounded-t-lg"
                onClick={() => handleExport('pdf')}
              >
                PDF
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/20"
                onClick={() => handleExport('csv')}
              >
                CSV
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/20 rounded-b-lg"
                onClick={() => handleExport('image')}
              >
                Image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-6">
        <div className="flex overflow-x-auto">
          <button
            className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'overview' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1A1A2F]'}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine size={16} />
            <span>Overview</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'bmi' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1A1A2F]'}`}
            onClick={() => setActiveTab('bmi')}
          >
            <FaWeight size={16} />
            <span>BMI & Weight</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'calories' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1A1A2F]'}`}
            onClick={() => setActiveTab('calories')}
          >
            <FaFireAlt size={16} />
            <span>Calories & BMR</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'workouts' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1A1A2F]'}`}
            onClick={() => setActiveTab('workouts')}
          >
            <FaDumbbell size={16} />
            <span>Workouts</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'adherence' ? 'bg-[#f67a45] text-white' : 'text-white hover:bg-[#1A1A2F]'}`}
            onClick={() => setActiveTab('adherence')}
          >
            <FaCalendarCheck size={16} />
            <span>Schedule Adherence</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      {activeTab === 'overview' && summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white/70 text-sm">Weight Change</h3>
              <FaWeight className={`${parseFloat(summary.weightChange) <= 0 ? 'text-green-500' : 'text-[#f67a45]'}`} />
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {summary.weightChange > 0 ? '+' : ''}{summary.weightChange} kg
            </p>
            <p className="text-white/50 text-xs">Over the last {timeRange === 'week' ? '7' : timeRange === 'month' ? '30' : '90'} days</p>
          </div>

          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white/70 text-sm">Workouts Completed</h3>
              <FaDumbbell className="text-[#f67a45]" />
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {summary.totalWorkouts}
            </p>
            <p className="text-white/50 text-xs">Total duration: {Math.floor(summary.totalDuration / 60)}h {summary.totalDuration % 60}m</p>
          </div>

          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white/70 text-sm">Calories Burned</h3>
              <FaFireAlt className="text-[#f67a45]" />
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {summary.totalCaloriesBurned.toLocaleString()}
            </p>
            <p className="text-white/50 text-xs">From {summary.totalWorkouts} workouts</p>
          </div>

          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white/70 text-sm">Avg. Daily Calories</h3>
              <FaFireAlt className="text-[#f67a45]" />
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {summary.avgCalories.toLocaleString()}
            </p>
            <p className="text-white/50 text-xs">Target: 2,200 calories</p>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <>
          {/* Overview - Multi-metric chart */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">Fitness Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={userData.bmiHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#fff' }}
                    tickFormatter={formatDate}
                    stroke="#666"
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#fff' }}
                    stroke="#666"
                    domain={[
                      Math.min(...userData.bmiHistory.map(d => d.value)) - 1,
                      Math.max(...userData.bmiHistory.map(d => d.value)) + 1
                    ]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#fff' }}
                    stroke="#666"
                    domain={[0, Math.max(...userData.weightHistory.map(d => d.value)) + 5]}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A2F', borderColor: '#f67a45', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  {filterOptions.showBMI && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="value"
                      name="BMI"
                      stroke="#f67a45"
                      activeDot={{ r: 8 }}
                    />
                  )}
                  {filterOptions.showWeight && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="value"
                      data={userData.weightHistory}
                      name="Weight (kg)"
                      stroke="#4ade80"
                      activeDot={{ r: 8 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Workout Activity */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">Recent Workout Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                    <th className="px-4 py-2 text-left">Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.workoutHistory.slice(-5).reverse().map((workout, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-[#1A1A2F]">
                      <td className="px-4 py-3">{formatDate(workout.date)}</td>
                      <td className="px-4 py-3">{workout.type}</td>
                      <td className="px-4 py-3">{workout.duration} min</td>
                      <td className="px-4 py-3">{workout.caloriesBurned} cal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Schedule Adherence Overview */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <h3 className="text-white font-bold mb-4">Weekly Schedule Adherence</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(userData.scheduleAdherence).map(([day, data]) => ({
                    day,
                    completed: data.completed,
                    scheduled: data.scheduled,
                    percentage: Math.round((data.completed / data.scheduled) * 100)
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" tick={{ fill: '#fff' }} stroke="#666" />
                  <YAxis tick={{ fill: '#fff' }} stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A2F', borderColor: '#f67a45', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="#4ade80" />
                  <Bar dataKey="scheduled" name="Scheduled" fill="#f67a45" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === 'bmi' && (
        <>
          {/* BMI History Chart */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">BMI History</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userData.bmiHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorBmi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f67a45" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f67a45" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#fff' }}
                    tickFormatter={formatDate}
                    stroke="#666"
                  />
                  <YAxis
                    tick={{ fill: '#fff' }}
                    stroke="#666"
                    domain={[
                      Math.min(...userData.bmiHistory.map(d => d.value)) - 1,
                      Math.max(...userData.bmiHistory.map(d => d.value)) + 1
                    ]}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A2F', borderColor: '#f67a45', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value, name) => [`${value} ${name === 'BMI' ? '' : 'kg'}`, name]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="BMI"
                    stroke="#f67a45"
                    fillOpacity={1}
                    fill="url(#colorBmi)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weight History Chart */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">Weight History</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userData.weightHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#fff' }}
                    tickFormatter={formatDate}
                    stroke="#666"
                  />
                  <YAxis
                    tick={{ fill: '#fff' }}
                    stroke="#666"
                    domain={[
                      Math.min(...userData.weightHistory.map(d => d.value)) - 1,
                      Math.max(...userData.weightHistory.map(d => d.value)) + 1
                    ]}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A2F', borderColor: '#f67a45', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value, name) => [`${value} kg`, name]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Weight"
                    stroke="#4ade80"
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BMI Log Table */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <h3 className="text-white font-bold mb-4">BMI Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">BMI</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Weight (kg)</th>
                    <th className="px-4 py-2 text-left">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.bmiHistory.slice(-10).reverse().map((entry, index, array) => {
                    const weightEntry = userData.weightHistory.find(w => w.date === entry.date);
                    const prevWeightEntry = index < array.length - 1
                      ? userData.weightHistory.find(w => w.date === array[index + 1].date)
                      : null;
                    const weightChange = prevWeightEntry
                      ? (weightEntry.value - prevWeightEntry.value).toFixed(1)
                      : '0.0';

                    return (
                      <tr key={entry.date} className="border-b border-gray-700 hover:bg-[#1A1A2F]">
                        <td className="px-4 py-3">{formatDate(entry.date)}</td>
                        <td className="px-4 py-3">{entry.value}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs
                            ${entry.category === 'Underweight' ? 'bg-blue-500/20 text-blue-300' :
                              entry.category === 'Normal' ? 'bg-green-500/20 text-green-300' :
                                entry.category === 'Overweight' ? 'bg-yellow-500/20 text-yellow-300' :
                                  'bg-red-500/20 text-red-300'
                            }`}>
                            {entry.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">{weightEntry?.value || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={weightChange > 0 ? 'text-red-400' : weightChange < 0 ? 'text-green-400' : 'text-gray-400'}>
                            {weightChange > 0 ? '+' : ''}{weightChange}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'calories' && (
        <>
          {/* Calorie Intake Chart */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">Calorie Intake vs. Goal</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={userData.calorieIntake}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#fff' }}
                    tickFormatter={formatDate}
                    stroke="#666"
                  />
                  <YAxis
                    tick={{ fill: '#fff' }}
                    stroke="#666"
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A2F', borderColor: '#f67a45', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="intake" name="Actual Intake" stroke="#f67a45" />
                  <Line type="monotone" dataKey="goal" name="Calorie Goal" stroke="#4ade80" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Macro Distribution Chart */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">Average Macro Distribution</h3>
            <div className="flex flex-col md:flex-row">
              <div className="h-60 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Protein', value: userData.calorieIntake.reduce((sum, day) => sum + day.protein, 0) / userData.calorieIntake.length * 4 },
                        { name: 'Carbs', value: userData.calorieIntake.reduce((sum, day) => sum + day.carbs, 0) / userData.calorieIntake.length * 4 },
                        { name: 'Fat', value: userData.calorieIntake.reduce((sum, day) => sum + day.fat, 0) / userData.calorieIntake.length * 9 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell key="protein" fill="#9333ea" />
                      <Cell key="carbs" fill="#3b82f6" />
                      <Cell key="fat" fill="#f59e0b" />
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1A1A2F', borderColor: '#f67a45', color: '#fff' }}
                      formatter={(value) => [`${Math.round(value)} calories`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 mt-4 md:mt-0 md:ml-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#9333ea] rounded-full mr-3"></div>
                  <div>
                    <p className="text-white font-medium">Protein</p>
                    <p className="text-white/60 text-sm">
                      {Math.round(userData.calorieIntake.reduce((sum, day) => sum + day.protein, 0) / userData.calorieIntake.length)}g
                      ({Math.round(userData.calorieIntake.reduce((sum, day) => sum + day.protein * 4, 0) / userData.calorieIntake.length)} cal)
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#3b82f6] rounded-full mr-3"></div>
                  <div>
                    <p className="text-white font-medium">Carbs</p>
                    <p className="text-white/60 text-sm">
                      {Math.round(userData.calorieIntake.reduce((sum, day) => sum + day.carbs, 0) / userData.calorieIntake.length)}g
                      ({Math.round(userData.calorieIntake.reduce((sum, day) => sum + day.carbs * 4, 0) / userData.calorieIntake.length)} cal)
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#f59e0b] rounded-full mr-3"></div>
                  <div>
                    <p className="text-white font-medium">Fat</p>
                    <p className="text-white/60 text-sm">
                      {Math.round(userData.calorieIntake.reduce((sum, day) => sum + day.fat, 0) / userData.calorieIntake.length)}g
                      ({Math.round(userData.calorieIntake.reduce((sum, day) => sum + day.fat * 9, 0) / userData.calorieIntake.length)} cal)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calorie Log Table */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <h3 className="text-white font-bold mb-4">Nutrition Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Calories</th>
                    <th className="px-4 py-2 text-left">Protein (g)</th>
                    <th className="px-4 py-2 text-left">Carbs (g)</th>
                    <th className="px-4 py-2 text-left">Fat (g)</th>
                    <th className="px-4 py-2 text-left">Goal</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.calorieIntake.slice(-10).reverse().map((entry) => (
                    <tr key={entry.date} className="border-b border-gray-700 hover:bg-[#1A1A2F]">
                      <td className="px-4 py-3">{formatDate(entry.date)}</td>
                      <td className="px-4 py-3">{entry.intake}</td>
                      <td className="px-4 py-3">{entry.protein}g</td>
                      <td className="px-4 py-3">{entry.carbs}g</td>
                      <td className="px-4 py-3">{entry.fat}g</td>
                      <td className="px-4 py-3">
                        <span className={entry.intake <= entry.goal ? 'text-green-400' : 'text-red-400'}>
                          {entry.intake <= entry.goal ? 'Met' : 'Exceeded'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'workouts' && (
        <>
          {/* Workout Frequency Chart */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">Workout Frequency</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    // Group workouts by date and count
                    Object.entries(
                      userData.workoutHistory.reduce((acc, workout) => {
                        // Extract week number or day depending on time range
                        const date = new Date(workout.date);
                        let key;
                        if (timeRange === 'week') {
                          // For week, use day name
                          key = date.toLocaleDateString('en-US', { weekday: 'short' });
                        } else {
                          // For month/quarter, group by week
                          const week = Math.ceil((date.getDate()) / 7);
                          key = `Week ${week}`;
                        }

                        if (!acc[key]) acc[key] = { period: key, count: 0, duration: 0 };
                        acc[key].count += 1;
                        acc[key].duration += workout.duration;
                        return acc;
                      }, {})
                    ).map(([_, data]) => data)
                  }
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="period" tick={{ fill: '#fff' }} stroke="#666" />
                  <YAxis yAxisId="left" tick={{ fill: '#fff' }} stroke="#666" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#fff' }} stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A2F', borderColor: '#f67a45', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" name="Workouts" fill="#f67a45" />
                  <Line yAxisId="right" type="monotone" dataKey="duration" name="Minutes" stroke="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Workout Types Distribution */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">Workout Types</h3>
            <div className="flex flex-col md:flex-row">
              <div className="h-60 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        Object.entries(
                          userData.workoutHistory.reduce((acc, workout) => {
                            if (!acc[workout.type]) acc[workout.type] = 0;
                            acc[workout.type] += 1;
                            return acc;
                          }, {})
                        ).map(([type, count]) => ({ name: type, value: count }))
                      }
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {
                        ['Strength', 'Cardio', 'HIIT', 'Yoga'].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#f67a45', '#4ade80', '#3b82f6', '#9333ea'][index % 4]} />
                        ))
                      }
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1A1A2F', borderColor: '#f67a45', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 mt-4 md:mt-0 md:ml-4">
                {
                  Object.entries(
                    userData.workoutHistory.reduce((acc, workout) => {
                      if (!acc[workout.type]) acc[workout.type] = { count: 0, duration: 0, calories: 0 };
                      acc[workout.type].count += 1;
                      acc[workout.type].duration += workout.duration;
                      acc[workout.type].calories += workout.caloriesBurned;
                      return acc;
                    }, {})
                  ).map(([type, data], index) => (
                    <div key={type} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3`}
                        style={{ backgroundColor: ['#f67a45', '#4ade80', '#3b82f6', '#9333ea'][index % 4] }}></div>
                      <div>
                        <p className="text-white font-medium">{type}</p>
                        <p className="text-white/60 text-sm">
                          {data.count} workouts · {data.duration} min · {data.calories} cal
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Workout Log Table */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <h3 className="text-white font-bold mb-4">Workout Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                    <th className="px-4 py-2 text-left">Calories</th>
                    <th className="px-4 py-2 text-left">Intensity</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.workoutHistory.slice(-10).reverse().map((workout, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-[#1A1A2F]">
                      <td className="px-4 py-3">{formatDate(workout.date)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs
                          ${workout.type === 'Strength' ? 'bg-[#f67a45]/20 text-[#f67a45]' :
                            workout.type === 'Cardio' ? 'bg-green-500/20 text-green-300' :
                              workout.type === 'HIIT' ? 'bg-blue-500/20 text-blue-300' :
                                'bg-purple-500/20 text-purple-300'
                          }`}>
                          {workout.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{workout.duration} min</td>
                      <td className="px-4 py-3">{workout.caloriesBurned} cal</td>
                      <td className="px-4 py-3">
                        <div className="w-24 bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-[#f67a45] h-2.5 rounded-full"
                            style={{ width: `${(workout.caloriesBurned / workout.duration) * 10}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'adherence' && (
        <>
          {/* Schedule Adherence Chart */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">Schedule Adherence</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(userData.scheduleAdherence).map(([day, data]) => ({
                    day,
                    completed: data.completed,
                    scheduled: data.scheduled,
                    adherenceRate: Math.round((data.completed / data.scheduled) * 100)
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" tick={{ fill: '#fff' }} stroke="#666" />
                  <YAxis tick={{ fill: '#fff' }} stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A2F', borderColor: '#f67a45', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value, name) => [name === 'adherenceRate' ? `${value}%` : value, name === 'adherenceRate' ? 'Adherence Rate' : name]}
                  />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="#4ade80" />
                  <Bar dataKey="scheduled" name="Scheduled" fill="#f67a45" />
                  <Line type="monotone" dataKey="adherenceRate" name="Adherence Rate" stroke="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Schedule Summary */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">Daily Schedule Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(userData.scheduleAdherence).map(([day, data]) => (
                <div key={day} className="bg-[#1A1A2F] rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 flex justify-between items-center">
                    {day}
                    <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                      {Math.round((data.completed / data.scheduled) * 100)}% Adherence
                    </span>
                  </h4>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-[#f67a45] mr-2" size={14} />
                      <span className="text-white/70 text-sm">{data.scheduled} Scheduled</span>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" size={14} />
                      <span className="text-white/70 text-sm">{data.completed} Completed</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                    <div
                      className={`h-2.5 rounded-full ${(data.completed / data.scheduled) >= 0.8 ? 'bg-green-500' :
                          (data.completed / data.scheduled) >= 0.6 ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`}
                      style={{ width: `${(data.completed / data.scheduled) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missed Workouts Analysis */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <h3 className="text-white font-bold mb-4">Missed Workouts Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2 text-left">Day</th>
                    <th className="px-4 py-2 text-left">Scheduled</th>
                    <th className="px-4 py-2 text-left">Completed</th>
                    <th className="px-4 py-2 text-left">Missed</th>
                    <th className="px-4 py-2 text-left">Adherence</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(userData.scheduleAdherence).map(([day, data]) => {
                    const adherenceRate = (data.completed / data.scheduled) * 100;
                    return (
                      <tr key={day} className="border-b border-gray-700 hover:bg-[#1A1A2F]">
                        <td className="px-4 py-3">{day}</td>
                        <td className="px-4 py-3">{data.scheduled}</td>
                        <td className="px-4 py-3">{data.completed}</td>
                        <td className="px-4 py-3">{data.scheduled - data.completed}</td>
                        <td className="px-4 py-3">{Math.round(adherenceRate)}%</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs
                            ${adherenceRate >= 80 ? 'bg-green-500/20 text-green-300' :
                              adherenceRate >= 60 ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                            }`}>
                            {adherenceRate >= 80 ? 'Excellent' :
                              adherenceRate >= 60 ? 'Good' :
                                'Needs Improvement'
                            }
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};

export default Reports;
