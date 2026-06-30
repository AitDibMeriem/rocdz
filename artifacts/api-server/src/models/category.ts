import mongoose, { Schema } from "mongoose";

const transform = (_: unknown, ret: Record<string, unknown>) => {
  ret.id = String(ret._id);
  delete ret._id;
  delete ret.__v;
  return ret;
};

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    imageUrl: String,
  },
  { timestamps: true, toJSON: { virtuals: true, transform }, toObject: { virtuals: true } },
);

export const Category = mongoose.model("Category", categorySchema);
