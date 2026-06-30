import mongoose, { Schema } from "mongoose";

const transform = (_: unknown, ret: Record<string, unknown>) => {
  ret.id = String(ret._id);
  delete ret._id;
  delete ret.__v;
  return ret;
};

const promoCodeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ["percent", "fixed"], default: "percent" },
    discountValue: { type: Number, required: true },
    expiryDate: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true, transform }, toObject: { virtuals: true } },
);

export const PromoCode = mongoose.model("PromoCode", promoCodeSchema);
