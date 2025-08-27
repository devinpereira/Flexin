import mongoose from 'mongoose';

const fitnessStatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // BMI History
    bmiHistory: [{
        date: {
            type: Date,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            enum: ['Underweight', 'Normal', 'Overweight', 'Obese'],
            required: true
        }
    }],

    // BMR History
    bmrHistory: [{
        date: {
            type: Date,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    }],

    // Workout History
    workoutHistory: [{
        date: {
            type: Date,
            required: true
        },
        duration: {
            type: Number,
            required: true // in minutes
        },
        caloriesBurned: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ['Strength', 'Cardio', 'HIIT', 'Yoga'],
            required: true
        }
    }],

    // Weight History
    weightHistory: [{
        date: {
            type: Date,
            required: true
        },
        value: {
            type: Number,
            required: true // in kg
        }
    }],

    // Schedule Adherence
    scheduleAdherence: {
        Monday: {
            scheduled: { type: Number, default: 0 },
            completed: { type: Number, default: 0 }
        },
        Tuesday: {
            scheduled: { type: Number, default: 0 },
            completed: { type: Number, default: 0 }
        },
        Wednesday: {
            scheduled: { type: Number, default: 0 },
            completed: { type: Number, default: 0 }
        },
        Thursday: {
            scheduled: { type: Number, default: 0 },
            completed: { type: Number, default: 0 }
        },
        Friday: {
            scheduled: { type: Number, default: 0 },
            completed: { type: Number, default: 0 }
        },
        Saturday: {
            scheduled: { type: Number, default: 0 },
            completed: { type: Number, default: 0 }
        },
        Sunday: {
            scheduled: { type: Number, default: 0 },
            completed: { type: Number, default: 0 }
        }
    },

    // Calorie Intake
    calorieIntake: [{
        date: {
            type: Date,
            required: true
        },
        intake: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        },
        protein: {
            type: Number,
            required: true // in grams
        },
        carbs: {
            type: Number,
            required: true // in grams
        },
        fat: {
            type: Number,
            required: true // in grams
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('FitnessStats', fitnessStatsSchema);
