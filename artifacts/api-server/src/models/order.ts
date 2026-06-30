import mongoose, { Schema } from "mongoose";

const transform = (_: unknown, ret: Record<string, unknown>) => {
  ret.id = String(ret._id);
  delete ret._id;
  delete ret.__v;
  return ret;
};

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    productType: { type: String, enum: ["laptop", "accessory"], required: true },
    title: String,
    price: Number,
    advance: Number,
    qty: { type: Number, default: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    phone2: String,
    address: { type: String, required: true },
    wilaya: String,
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    advancePaid: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    deliveryType: { type: String, enum: ["domicile", "bureau"], default: "bureau" },
    paymentMethod: { type: String, default: "cash" },
    promoCode: String,
    promoDiscount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["reserved", "confirmed", "advance_paid", "verse", "prepared", "shipped", "delivered", "cancelled", "returned"],
      default: "reserved",
    },
    notes: String,
  },
  { timestamps: true, toJSON: { virtuals: true, transform }, toObject: { virtuals: true } },
);

export const Order = mongoose.model("Order", orderSchema);
