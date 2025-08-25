import React from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";

const PaymentDetailsModal = ({
  isOpen,
  onClose,
  trainer,
  paymentDetails,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121225] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Payment Details</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-white/70">Loading payment details...</p>
            </div>
          ) : (
            <>
              {/* Trainer Info */}
              <div className="bg-[#1A1A2F] rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-white mb-3">
                  Trainer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/70 text-sm">Name</p>
                    <p className="text-white font-medium">
                      {paymentDetails?.trainerName || trainer?.trainerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Total Paid</p>
                    <p className="text-white font-medium">
                      {paymentDetails?.totalAmountPaid?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Next Payment ID</p>
                    <p className="text-white font-medium">
                      {paymentDetails?.nextPaymentId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Current Amount Due</p>
                    <p className="text-white font-medium">
                      Rs.{" "}
                      {paymentDetails?.currentAmountDue?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#1A1A2F] rounded-lg p-4 text-center">
                  <FaMoneyBillWave
                    className="mx-auto mb-2 text-green-400"
                    size={24}
                  />
                  <p className="text-white/70 text-sm">Total Paid</p>
                  <p className="text-white text-xl font-bold">
                    Rs. {paymentDetails?.totalAmountPaid?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-[#1A1A2F] rounded-lg p-4 text-center">
                  <FaCreditCard
                    className="mx-auto mb-2 text-blue-400"
                    size={24}
                  />
                  <p className="text-white/70 text-sm">Total Payments</p>
                  <p className="text-white text-xl font-bold">
                    {paymentDetails?.paymentHistory?.length || 0}
                  </p>
                </div>
                <div className="bg-[#1A1A2F] rounded-lg p-4 text-center">
                  <FaCalendarAlt
                    className="mx-auto mb-2 text-orange-400"
                    size={24}
                  />
                  <p className="text-white/70 text-sm">Last Paid</p>
                  <p className="text-white text-sm font-medium">
                    {paymentDetails?.lastPaidAt
                      ? new Date(paymentDetails.lastPaidAt).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  Payment History
                </h3>
                {paymentDetails?.paymentHistory?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full bg-[#1A1A2F] rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-[#232342] text-white/70">
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Payment ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Date Paid
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {paymentDetails.paymentHistory.map((payment, index) => (
                          <tr
                            key={payment.paymentId || index}
                            className="hover:bg-[#2A2A4A]"
                          >
                            <td className="px-4 py-3 whitespace-nowrap text-white font-medium">
                              {payment.paymentId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-white">
                              Rs. {payment.amount?.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-white/70">
                              {new Date(payment.datePaid).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  payment.status === "completed"
                                    ? "bg-green-500/20 text-green-400"
                                    : payment.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : payment.status === "failed"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-[#1A1A2F] rounded-lg p-8 text-center">
                    <p className="text-white/70">No payment history found</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#f67a45] text-white rounded-lg hover:bg-[#e56935] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
