import mongoose, { Schema } from "mongoose";

const transform = (_: unknown, ret: Record<string, unknown>) => {
  ret.id = String(ret._id);
  delete ret._id;
  delete ret.__v;
  return ret;
};

const accessorySchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    salePrice: Number,
    stock: { type: Number, default: 0 },
    imageUrl: String,
    color: String,
    brand: String,
    warranty: String,
    compatibility: String,
    specifications: String,
  },
  { toJSON: { virtuals: true, transform }, toObject: { virtuals: true } },
);

export const Accessory = mongoose.model("Accessory", accessorySchema);
