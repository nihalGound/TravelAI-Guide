import mongoose, { Connection } from "mongoose";

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (globalThis as any).mongoose;

if (!cached) {
  cached = (globalThis as any).mongoose = { conn: null, promise: null };
}

export default async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string)
      .then((mongoose) => {
        return mongoose;
      });
  }
  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance.connection;
  return cached.conn;
}
