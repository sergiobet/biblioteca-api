import mongoose from 'mongoose';
import config from './env';
import logger from '../utils/logger';

class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('MongoDB ya está conectado');
      return;
    }

    try {
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      await mongoose.connect(config.MONGODB_URI, options);
      
      this.isConnected = true;
      logger.info('✅ MongoDB conectado exitosamente');
      
      // Eventos de conexión
      mongoose.connection.on('error', (error) => {
        logger.error('❌ Error de conexión MongoDB:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('⚠️ MongoDB desconectado');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('🔄 MongoDB reconectado');
        this.isConnected = true;
      });

    } catch (error) {
      logger.error('❌ Error al conectar a MongoDB:', error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('✅ MongoDB desconectado exitosamente');
    } catch (error) {
      logger.error('❌ Error al desconectar MongoDB:', error);
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default Database.getInstance();