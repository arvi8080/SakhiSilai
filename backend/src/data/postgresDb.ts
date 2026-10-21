import { pgPool, withTransaction } from './postgres';
import type {
  User,
  TailorProfile,
  ServiceCategory,
  DesignCatalogItem,
  Order,
  CustomDesignRequest,
  LocationState,
  Review,
  SystemNotification,
  PaymentRecord
} from '../types';

function parseStoredJson(value: unknown, fallback: unknown = '') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function mapUser(row: any): User {
  return {
    ...row,
    isVerified: Boolean(row.isVerified),
    isBlocked: Boolean(row.isBlocked)
  };
}

function mapTailor(row: any): TailorProfile {
  return {
    ...row,
    isVerified: Boolean(row.isVerified),
    servicesOffered: parseStoredJson(row.servicesOffered, []),
    skills: parseStoredJson(row.skills, []),
    galleryImages: parseStoredJson(row.galleryImages, [])
  };
}

function mapOrder(row: any): Order {
  return {
    ...row,
    hasDeliveryAvailable: Boolean(row.hasDeliveryAvailable),
    measurements: parseStoredJson(row.measurements),
    statusHistory: parseStoredJson(row.statusHistory, [])
  };
}

function mapCustomRequest(row: any): CustomDesignRequest {
  return {
    ...row,
    offers: parseStoredJson(row.offers, [])
  };
}

function mapNotification(row: any): SystemNotification {
  return {
    ...row,
    isRead: Boolean(row.isRead)
  };
}

export class PostgreSQLDatabase {
  async healthCheck(): Promise<boolean> {
    const result = await pgPool.query('SELECT 1');
    return result.rowCount === 1;
  }

  async users(): Promise<User[]> {
    const result = await pgPool.query('SELECT * FROM users');
    return result.rows.map(mapUser);
  }

  async complaints(): Promise<any[]> {
    const result = await pgPool.query(
      'SELECT * FROM complaints ORDER BY "createdAt" DESC'
    );
    return result.rows;
  }

  async tailors(): Promise<TailorProfile[]> {
    const result = await pgPool.query('SELECT * FROM tailors');
    return result.rows.map(mapTailor);
  }

  async categories(): Promise<ServiceCategory[]> {
    const result = await pgPool.query('SELECT * FROM categories');
    return result.rows.map(row => ({
      ...row,
      popular: Boolean(row.popular)
    }));
  }

  async designs(): Promise<DesignCatalogItem[]> {
    const result = await pgPool.query('SELECT * FROM designs');
    return result.rows.map(row => ({
      ...row,
      isAvailable: Boolean(row.isAvailable)
    }));
  }

  async listOrders(
    customerId?: string,
    tailorId?: string
  ): Promise<Order[]> {
    const conditions: string[] = [];
    const values: string[] = [];

    if (customerId) {
      values.push(customerId);
      conditions.push(`"customerId" = $${values.length}`);
    }

    if (tailorId) {
      values.push(tailorId);
      conditions.push(`"tailorId" = $${values.length}`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const result = await pgPool.query(
      `SELECT * FROM orders ${whereClause} ORDER BY "createdAt" DESC`,
      values
    );

    return result.rows.map(mapOrder);
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    const result = await pgPool.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );

    return result.rows.length
      ? mapOrder(result.rows[0])
      : undefined;
  }

  async customRequests(): Promise<CustomDesignRequest[]> {
    const result = await pgPool.query(
      'SELECT * FROM custom_requests ORDER BY "createdAt" DESC'
    );

    return result.rows.map(mapCustomRequest);
  }

  async reviews(): Promise<Review[]> {
    const result = await pgPool.query('SELECT * FROM reviews');
    return result.rows as Review[];
  }

  async listReviews(customerId?: string): Promise<Review[]> {
    const result = customerId
      ? await pgPool.query(
          'SELECT * FROM reviews WHERE "customerId" = $1 ORDER BY date DESC',
          [customerId]
        )
      : await pgPool.query(
          'SELECT * FROM reviews ORDER BY date DESC'
        );

    return result.rows as Review[];
  }

  async notifications(): Promise<SystemNotification[]> {
    const result = await pgPool.query(
      'SELECT * FROM notifications ORDER BY timestamp DESC'
    );

    return result.rows.map(mapNotification);
  }

  async locations(): Promise<LocationState[]> {
    const result = await pgPool.query('SELECT * FROM locations');

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      districts: parseStoredJson(row.districts, [])
    })) as LocationState[];
  }

  async listMeasurements(userId: string) {
    const result = await pgPool.query(
      'SELECT * FROM measurement_profiles WHERE "userId" = $1 ORDER BY "createdAt" DESC',
      [userId]
    );

    return result.rows;
  }

  async payments(): Promise<PaymentRecord[]> {
    const result = await pgPool.query(
      'SELECT * FROM payments ORDER BY timestamp DESC'
    );

    return result.rows as PaymentRecord[];
  }

  async getPaymentsByOrder(orderId: string): Promise<PaymentRecord[]> {
    const result = await pgPool.query(
      'SELECT * FROM payments WHERE "orderId" = $1 ORDER BY timestamp DESC',
      [orderId]
    );

    return result.rows as PaymentRecord[];
  }
  async addVillage(
    stateId: string,
    districtId: string,
    villageName: string
  ): Promise<boolean> {
    return withTransaction(async (client) => {
      const result = await client.query(
        'SELECT id, districts FROM locations WHERE id = $1 FOR UPDATE',
        [stateId]
      );

      if (result.rows.length === 0) {
        return false;
      }

      const location = result.rows[0];
      const districts = parseStoredJson(location.districts, []);

      if (!Array.isArray(districts)) {
        return false;
      }

      const district = districts.find(
        (item: any) =>
          item &&
          typeof item === 'object' &&
          item.id === districtId
      );

      if (!district) {
        return false;
      }

      if (!Array.isArray(district.villages)) {
        district.villages = [];
      }

      const villageExists = district.villages.some(
        (village: any) =>
          typeof village === 'string' &&
          village.toLowerCase() === villageName.toLowerCase()
      );

      if (!villageExists) {
        district.villages.push(villageName);
      }

      await client.query(
        'UPDATE locations SET districts = $1 WHERE id = $2',
        [JSON.stringify(districts), stateId]
      );

      return true;
    });
  }

  async close(): Promise<void> {
    await pgPool.end();
  }
}

export const postgresDb = new PostgreSQLDatabase();

export { pgPool, withTransaction };