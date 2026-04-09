import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  connectedUri: string | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
  connectedUri: null,
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  const mongoUri = process.env.MONGODB_URI ?? process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("Please define MONGODB_URI (or MONGO_URI) environment variable");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri)
      .then((conn) => {
        cached.connectedUri = mongoUri;
        console.info("[db] MongoDB connected successfully.");
        return conn;
      })
      .catch((error) => {
        console.error("[db] MongoDB connection failed:", error);
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
