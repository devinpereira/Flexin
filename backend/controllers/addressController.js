import Address from "../models/Address.js";

// Get User Addresses
export const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user._id;

        const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching addresses",
            error: error.message
        });
    }
};

// Get Single Address
export const getAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID"
            });
        }

        const address = await Address.findOne({ _id: id, userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.status(200).json({
            success: true,
            address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching address",
            error: error.message
        });
    }
};

// Create Address
export const createAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            fullName,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            phoneNumber,
            isDefault = false
        } = req.body;

        // Validation
        if (!fullName || !addressLine1 || !city || !state || !postalCode || !country || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // If this address is set as default, remove default from others
        if (isDefault) {
            await Address.updateMany(
                { userId },
                { isDefault: false }
            );
        }

        const address = new Address({
            userId,
            fullName,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            phoneNumber,
            isDefault
        });

        await address.save();

        res.status(201).json({
            success: true,
            message: "Address created successfully",
            address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating address",
            error: error.message
        });
    }
};

// Update Address
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updates = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID"
            });
        }

        // If setting this address as default, remove default from others
        if (updates.isDefault === true) {
            await Address.updateMany(
                { userId, _id: { $ne: id } },
                { isDefault: false }
            );
        }

        const address = await Address.findOneAndUpdate(
            { _id: id, userId },
            updates,
            { new: true, runValidators: true }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating address",
            error: error.message
        });
    }
};

// Delete Address
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID"
            });
        }

        const address = await Address.findOneAndDelete({ _id: id, userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // If deleted address was default, set another address as default
        if (address.isDefault) {
            const nextAddress = await Address.findOne({ userId }).sort({ createdAt: -1 });
            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting address",
            error: error.message
        });
    }
};

// Set Default Address
export const setDefaultAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID"
            });
        }

        // Remove default from all addresses
        await Address.updateMany(
            { userId },
            { isDefault: false }
        );

        // Set the specified address as default
        const address = await Address.findOneAndUpdate(
            { _id: id, userId },
            { isDefault: true },
            { new: true }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error setting default address",
            error: error.message
        });
    }
};
