import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConn = (global as any).mongoose;

if (!cached) {
  cached = {
    conn: null,
    promise: null
  };
  (global as any).mongoose = cached;
}

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: "feedback"
  });

  cached.conn = await cached.promise;

  return cached.conn;
}
