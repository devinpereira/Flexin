import React from 'react';
import { FaBoxes, FaExclamationTriangle, FaTimesCircle, FaDollarSign } from 'react-icons/fa';

const InventoryDashboard = ({ analytics, lowStockCount = 0, outOfStockCount = 0 }) => {
    console.log('Dashboard received props:', { analytics, lowStockCount, outOfStockCount });

    const metrics = [
        {
            title: 'Total Products',
            value: analytics?.totalProducts || 0,
            icon: FaBoxes,
            color: 'blue'
        },
        {
            title: 'Total Value',
            value: `$${(analytics?.totalValue || 0).toLocaleString()}`,
            icon: FaDollarSign,
            color: 'green'
        },
        {
            title: 'Low Stock Items',
            value: lowStockCount,
            icon: FaExclamationTriangle,
            color: 'yellow'
        },
        {
            title: 'Out of Stock',
            value: outOfStockCount,
            icon: FaTimesCircle,
            color: 'red'
        }
    ];

    const getColorClasses = (color) => {
        switch (color) {
            case 'blue':
                return 'bg-blue-500/20 text-blue-400 border-blue-500';
            case 'green':
                return 'bg-green-500/20 text-green-400 border-green-500';
            case 'yellow':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
            case 'red':
                return 'bg-red-500/20 text-red-400 border-red-500';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                    <div key={index} className="bg-[#0A0A1F] rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm">{metric.title}</p>
                                <p className="text-white text-2xl font-bold">{metric.value}</p>
                            </div>
                            <div className={`p-3 rounded-full border ${getColorClasses(metric.color)}`}>
                                <Icon size={20} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default InventoryDashboard;
