import mongoose, { Schema } from "mongoose";

const transform = (_: unknown, ret: Record<string, unknown>) => {
  ret.id = String(ret._id);
  delete ret._id;
  delete ret.__v;
  return ret;
};

const laptopSchema = new Schema(
  {
    sku: String,
    brand: { type: String, required: true },
    model: { type: String, required: true },
    title: { type: String, required: true },
    processor: String,
    processorSpeedMin: String,
    processorSpeedMax: String,
    cores: Number,
    threads: Number,
    ram: Number,
    ramType: String,
    storage: Number,
    storageType: String,
    gpu: String,
    operatingSystem: String,
    screenSize: String,
    screenResolution: String,
    touchscreen: Boolean,
    batteryEstimation: String,
    weight: String,
    conditionScore: Number,
    conditionDescription: String,
    warrantyMonths: Number,
    price: { type: Number, required: true },
    advance: { type: Number, default: 0 },
    stockQuantity: { type: Number, default: 0 },
    condition: { type: String, enum: ["new", "refurbished"], required: true },
    description: String,
    imageUrl: String,
    mediaUrls: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    color: String,
    salePrice: Number,
  },
  { timestamps: true, toJSON: { virtuals: true, transform }, toObject: { virtuals: true } },
);

export const Laptop = mongoose.model("Laptop", laptopSchema);
