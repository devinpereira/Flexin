import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus, FaEdit } from 'react-icons/fa';

const StockAdjustmentModal = ({ isOpen, onClose, item, onUpdate }) => {
    const [quantity, setQuantity] = useState(0);
    const [reason, setReason] = useState('adjustment');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update quantity when item changes
    useEffect(() => {
        if (item) {
            const stock = item?.stock?.currentStock || item?.currentStock || item?.inStock || 0;
            setQuantity(stock);
        }
    }, [item]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Use the correct product ID for the backend call
            const productId = item?.productId?._id || item?.productId || item?._id || item?.id;

            if (!productId) {
                throw new Error('Product ID not found');
            }

            await onUpdate(productId, {
                quantity: parseInt(quantity),
                reason,
                notes
            });
            onClose();
        } catch (error) {
            console.error('Error updating stock:', error);
            // You could add a toast notification here
        } finally {
            setIsSubmitting(false);
        }
    };

    const adjustQuantity = (amount) => {
        setQuantity(prev => Math.max(0, prev + amount));
    };

    if (!isOpen) return null;

    const productName = item?.productId?.productName || item?.name || 'N/A';
    const currentStock = item?.stock?.currentStock || item?.currentStock || item?.inStock || 0;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-[#0A0A1F] rounded-lg p-6 w-full max-w-md mx-4 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Adjust Stock</h2>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="mb-4">
                    <h3 className="text-white font-medium">{productName}</h3>
                    <p className="text-white/70 text-sm">Current Stock: {currentStock}</p>
                    {quantity !== currentStock && (
                        <p className={`text-sm font-medium ${quantity > currentStock ? 'text-green-400' : 'text-red-400'
                            }`}>
                            Change: {quantity > currentStock ? '+' : ''}{quantity - currentStock}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-medium mb-2">
                            New Quantity
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => adjustQuantity(-1)}
                                className="p-2 bg-[#121225] text-white rounded hover:bg-[#1d1d3a]"
                            >
                                <FaMinus size={14} />
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                min="0"
                                className="flex-1 bg-[#121225] border border-white/20 rounded px-3 py-2 text-white text-center"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => adjustQuantity(1)}
                                className="p-2 bg-[#121225] text-white rounded hover:bg-[#1d1d3a]"
                            >
                                <FaPlus size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-white text-sm font-medium mb-2">
                            Reason
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-[#121225] border border-white/20 rounded px-3 py-2 text-white"
                        >
                            <option value="adjustment">Manual Adjustment</option>
                            <option value="damage">Damaged Stock</option>
                            <option value="theft">Theft/Loss</option>
                            <option value="return">Customer Return</option>
                            <option value="restock">Restock</option>
                            <option value="correction">Inventory Correction</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-white text-sm font-medium mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes..."
                            className="w-full bg-[#121225] border border-white/20 rounded px-3 py-2 text-white"
                            rows="3"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-[#121225] text-white py-2 px-4 rounded hover:bg-[#1d1d3a]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-[#f67a45] text-white py-2 px-4 rounded hover:bg-[#e55a2b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            {isSubmitting ? 'Updating...' : 'Update Stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockAdjustmentModal;
