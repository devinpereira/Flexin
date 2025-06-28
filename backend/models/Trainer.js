import mongoose from 'mongoose';


const certificateSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  year: Number,
});

const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const packageSchema = new mongoose.Schema({
  name: String,
  price: Number,
  features: [String],
});

const feedbackSchema = new mongoose.Schema({
  userName: String,
  comment: String,
  rating: { type: Number, min: 1, max: 5 },
  photos: [String], // URLs to feedback images
  createdAt: { type: Date, default: Date.now },
});

const trainerSchema = new mongoose.Schema({
  userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim:true 
  },
  age: {
    type:Number,
    required : true,
    min:18,
    max:100
  },
  bio:{
    type:String
  },
  profilePhoto: {
    type: String,
    default: "default-profile-photo.jpg"
  },
  certificates: [certificateSchema],
  services: [serviceSchema],
  photos: [String], // URLs to trainer photos
  packages: [packageSchema],
  feedbacks: [feedbackSchema],
  availabilityStatus: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
},
{
  timestamps: true,
});

export default mongoose.model("Trainer", trainerSchema);