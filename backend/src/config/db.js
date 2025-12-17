import mongoose from 'mongoose';

export async function connectDb(mongoUri) {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
  } catch (error) {
    const redactMongoUri = (uri) => {
      if (!uri) return '<redacted>';

      // Best effort string-based redaction: hide credentials and query string.
      // Examples:
      // - mongodb+srv://user:pass@host/db?x=y -> mongodb+srv://<redacted>@host/db
      // - mongodb://user@host -> mongodb://<redacted>@host
      let safe = String(uri);
      safe = safe.replace(/:\/\/([^@/]+)@/i, '://<redacted>@');
      safe = safe.replace(/\?.*$/, '');
      return safe;
    };

    let redactedUri = redactMongoUri(mongoUri);
    let hostHint = '';
    try {
      const url = new URL(mongoUri);
      url.username = '';
      url.password = '';
      url.search = '';
      redactedUri = url.toString();
      hostHint = ` (host: ${url.hostname}${url.port ? `:${url.port}` : ''})`;
    } catch {
      // ignore URI parse failures; we'll still show a helpful message
    }

    const message =
      `Failed to connect to MongoDB${hostHint}. ` +
      `Make sure MongoDB is running and MONGODB_URI is correct. ` +
      `Current MONGODB_URI: ${redactedUri}`;

    const wrapped = new Error(message, { cause: error });
    wrapped.name = 'MongoConnectionError';
    throw wrapped;
  }
}
