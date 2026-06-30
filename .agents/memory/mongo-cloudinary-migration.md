---
name: MongoDB + Cloudinary migration
description: ROC DZ migrated from Drizzle/PostgreSQL + Replit Object Storage to Mongoose/MongoDB + Cloudinary. Key decisions and gotchas.
---

## What changed

- DB: PostgreSQL + Drizzle → MongoDB Atlas + Mongoose
- Images: Replit Object Storage (presigned URL 2-step) → Cloudinary (single POST to `/api/upload`)
- Models now live in `artifacts/api-server/src/models/` (not `lib/db`)
- `lib/db` still exists as a workspace package but api-server no longer imports it

## ID format change

- Was: serial integer (PostgreSQL auto-increment)
- Now: MongoDB ObjectId as string
- Mongoose `toJSON` transform: `_id` → `id` (string), removes `__v`
- Frontend `CartItem.laptopId` changed from `number` to `string`
- The old `100000 + accessory.id` cart hack is gone — accessories use their MongoDB string ID directly

**Why:** MongoDB native IDs; cleaner than maintaining a counter collection.

## Order items shape

Orders store `{ productId, productType: "laptop"|"accessory", title, price, advance, qty }`.
Backend also accepts legacy `{ laptopId, isLaptop }` for compatibility.

## Upload flow

Frontend POSTs multipart to `/api/upload` → server streams to Cloudinary → returns `{ url: "https://res.cloudinary.com/..." }`.
No presigned URLs, no Replit storage proxy.

## Express 5 wildcard gotcha

Express 5 + path-to-regexp v8 rejects bare `*`. Use `/{*path}` instead.

## Atlas Network Access

MongoDB Atlas must have `0.0.0.0/0` in Network Access for Replit and Vercel to connect.
Without this, get TLS error: `tlsv1 alert internal error (SSL alert number 80)`.

## Required env vars / secrets

- `MONGODB_URI` — secret
- `CLOUDINARY_CLOUD_NAME` — env var (shared)
- `CLOUDINARY_API_KEY` — secret
- `CLOUDINARY_API_SECRET` — secret
