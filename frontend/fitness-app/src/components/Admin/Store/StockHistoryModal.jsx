import React, { useState, useEffect } from 'react';
import { FaTimes, FaHistory, FaArrowUp, FaArrowDown, FaCalendarAlt } from 'react-icons/fa';
import { adminInventoryApi } from '../../../api/adminStoreApi';

const StockHistoryModal = ({ isOpen, onClose, item }) => {
    const [stockHistory, setStockHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('30'); // Default to last 30 days

    useEffect(() => {
        if (isOpen && item) {
            loadStockHistory();
        }
    }, [isOpen, item, dateFilter]);

    const loadStockHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const productId = item?.productId?._id || item?.productId || item?._id;

            if (!productId) {
                throw new Error('Product ID not found');
            }

            const response = await adminInventoryApi.getStockHistory(productId, {
                days: dateFilter
            });

            setStockHistory(response.data || []);
        } catch (err) {
            console.error('Error loading stock history:', err);
            setError('Failed to load stock history');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getTransactionIcon = (transaction) => {
        if (transaction.direction === 'in' || transaction.type === 'in') {
            return <FaArrowUp className="text-green-400" size={14} />;
        }
        return <FaArrowDown className="text-red-400" size={14} />;
    };

    const getTransactionColor = (transaction) => {
        if (transaction.direction === 'in' || transaction.type === 'in') {
            return 'text-green-400';
        }
        return 'text-red-400';
    };

    if (!isOpen) return null;

    const productName = item?.productId?.productName || item?.name || 'N/A';

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-[#0A0A1F] rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FaHistory />
                            Stock History
                        </h2>
                        <p className="text-white/70">{productName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-2">
                        <FaCalendarAlt className="inline mr-2" />
                        Filter by Period
                    </label>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-[#121225] border border-white/20 rounded px-3 py-2 text-white"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="365">Last year</option>
                        <option value="all">All time</option>
                    </select>
                </div>

                <div className="overflow-y-auto max-h-96">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-flex flex-col items-center gap-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f67a45]"></div>
                                <p className="text-white/70 font-medium">Loading stock history...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="inline-flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <FaTimes className="text-red-400" size={24} />
                                </div>
                                <p className="text-red-400 font-medium">{error}</p>
                                <button
                                    onClick={loadStockHistory}
                                    className="text-[#f67a45] hover:text-[#e55a2b] font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : stockHistory.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-[#121225] rounded-full flex items-center justify-center">
                                    <FaHistory className="text-white/50" size={24} />
                                </div>
                                <p className="text-white/70 font-medium">No stock history found</p>
                                <p className="text-white/50 text-sm">No transactions found for this period</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {stockHistory.map((record, index) => (
                                <div
                                    key={index}
                                    className="bg-[#121225] rounded-lg p-4 border border-white/10"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getTransactionIcon(record.transaction)}
                                            <div>
                                                <p className="text-white font-medium">
                                                    {record.transaction.reason || 'Stock adjustment'}
                                                </p>
                                                <p className="text-white/70 text-sm">
                                                    {formatDate(record.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-medium ${getTransactionColor(record.transaction)}`}>
                                                {record.transaction.direction === 'in' || record.transaction.type === 'in' ? '+' : '-'}
                                                {record.transaction.quantity}
                                            </p>
                                            <p className="text-white/70 text-sm">
                                                {record.stock?.previousStock || record.previousStock} → {record.stock?.newStock || record.newStock}
                                            </p>
                                        </div>
                                    </div>
                                    {record.notes && (
                                        <p className="text-white/60 text-sm mt-2 pl-8">
                                            {record.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-[#121225] text-white py-2 px-4 rounded hover:bg-[#1d1d3a]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockHistoryModal;
