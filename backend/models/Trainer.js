import mongoose from 'mongoose';


const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  year: { type: Number, required: true },
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const packageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: ["Silver", "Gold", "Ultimate"]
  },
  price: { type: Number, required: true },
  features: [{ type: String, required: true }],
});

const feedbackSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
});

const socialMediaSchema = new mongoose.Schema({
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  tiktok: { type: String, default: "" },
  twitter: { type: String, default: "" },
});

const trainerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      default: "Certified Trainer",
    },
    phone: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Validates a 10-digit phone number
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    bio: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      required: true,
      default: "default-profile-photo.jpg",
    },
    certificates: {
      type: [certificateSchema],
      required: true,
      default: [],
    },
    services: {
      type: [serviceSchema],
      required: true,
      default: [],
    },
    photos: {
      type: [String],
      required: true,
      default: [],
    },
    packages: {
      type: [packageSchema],
      required: true,
      default: [],
    },
    feedbacks: {
      type: [feedbackSchema],
      default: [],
    },
    socialMedia: { // need when creating a trainer profile
      type: socialMediaSchema,
      default: {},
    },
    rating: { 
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
      required: true,
    },
    followers: [
  { type: mongoose.Schema.Types.ObjectId, ref: "User" }
],
specialties: {
  type: [String],
  required: true,
  default: [],
  enum: [
    "Strength & Conditioning",
    "Yoga & Flexibility",
    "Weight Loss",
    "Nutrition",
    "Cardio & HIIT",
    "Pilates"
  ]
},
status: {
  type: String,
  enum: ['active', 'inactive', 'pending'],
  default: 'pending'
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Trainer", trainerSchema);