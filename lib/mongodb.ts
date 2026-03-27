import mongoose, { Connection } from 'mongoose';

// MongoDB connection string from environment variable.
// In Next.js, use NEXT_PUBLIC_ only for client-facing values; DB URIs should be private.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// TypeScript assertion: after the nil guard above, this is guaranteed to be a string.
const uri = MONGODB_URI as string;

// Global cache to store connection across hot reloads in development.
interface MongooseGlobal {
  mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// @ts-ignore Augment global object in Next.js runtime environments.
const globalWithMongoose = global as unknown as MongooseGlobal;

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Returns a cached Mongoose connection or establishes a new one.
 */
export async function connectToDatabase(): Promise<Connection> {
  if (globalWithMongoose.mongoose.conn) {
    return globalWithMongoose.mongoose.conn;
  }

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose
      .connect(uri, {
        // useNewUrlParser and useUnifiedTopology are default in mongoose v6+
        // Increase timeouts for slow/unreliable networks
        serverSelectionTimeoutMS: 30000, // 30 seconds to find a server
        socketTimeoutMS: 45000, // 45 seconds for socket operations
        connectTimeoutMS: 10000, // 10 seconds initial connection attempt
        retryWrites: true, // Already in URI but explicit here
        maxPoolSize: 10,
      })
      .then((mongooseInstance) => {
        return mongooseInstance.connection;
      });
  }

  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  return globalWithMongoose.mongoose.conn;
}

/**
 * When closing the app (e.g., in tests), you can disconnect explicitly.
 */
export async function disconnectDatabase(): Promise<void> {
  if (globalWithMongoose.mongoose.conn) {
    await globalWithMongoose.mongoose.conn.close();
    globalWithMongoose.mongoose.conn = null;
    globalWithMongoose.mongoose.promise = null;
  }
}
