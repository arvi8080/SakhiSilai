const Database = require("better-sqlite3");
const { Client } = require("pg");

const SQLITE_PATH = "./data/sakhisilai.db";
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const sqlite = new Database(SQLITE_PATH, { readonly: true });
const pg = new Client({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const tables = [
  {
    name: "categories",
    columns: [
      "id",
      "nameEn",
      "nameHi",
      "iconName",
      "descriptionEn",
      "descriptionHi",
      "startingPrice",
      "estDays",
      "popular",
    ],
  },
  {
    name: "complaints",
    columns: [
      "id",
      "orderId",
      "orderNumber",
      "complainantName",
      "complainantRole",
      "complainantPhone",
      "againstName",
      "category",
      "subject",
      "description",
      "status",
      "createdAt",
      "resolutionNote",
    ],
  },
  {
    name: "custom_requests",
    columns: [
      "id",
      "customerId",
      "customerName",
      "customerVillage",
      "customerDistrict",
      "customerState",
      "requestTitle",
      "clothingCategory",
      "referenceImage",
      "specialInstructions",
      "requiredDate",
      "createdAt",
      "status",
      "offers",
      "acceptedQuoteId",
    ],
  },
  {
    name: "designs",
    columns: [
      "id",
      "tailorId",
      "tailorName",
      "categoryId",
      "categoryName",
      "title",
      "titleHi",
      "image",
      "price",
      "estDays",
      "description",
      "isAvailable",
    ],
  },
  {
    name: "idempotency_records",
    columns: [
      "scope",
      "idempotencyKey",
      "ownerId",
      "responseJson",
      "createdAt",
    ],
  },
  {
    name: "locations",
    columns: ["id", "name", "districts"],
  },
  {
    name: "measurement_profiles",
    columns: [
      "id",
      "userId",
      "label",
      "clothingType",
      "bustOrChest",
      "waist",
      "hips",
      "length",
      "shoulder",
      "sleeveLength",
      "neckDepth",
      "additionalNotes",
      "createdAt",
    ],
  },
  {
    name: "notifications",
    columns: [
      "id",
      "targetRole",
      "titleEn",
      "titleHi",
      "messageEn",
      "messageHi",
      "timestamp",
      "isRead",
      "type",
      "recipientId",
    ],
  },
  {
    name: "orders",
    columns: [
      "id",
      "orderNumber",
      "customerId",
      "customerName",
      "customerPhone",
      "customerVillage",
      "customerDistrict",
      "customerState",
      "tailorId",
      "tailorName",
      "tailorVillage",
      "tailorPhone",
      "categoryId",
      "categoryName",
      "designTitle",
      "designImage",
      "price",
      "advancePaid",
      "paymentMethod",
      "paymentStatus",
      "status",
      "handoverMethod",
      "hasDeliveryAvailable",
      "measurements",
      "specialInstructions",
      "requiredDate",
      "createdAt",
      "updatedAt",
      "statusHistory",
      "appointmentDate",
      "appointmentTimeSlot",
      "appointmentNotes",
      "rating",
      "reviewText",
    ],
  },
  {
    name: "payment_intents",
    columns: [
      "idempotencyKey",
      "ownerId",
      "orderId",
      "amountPaise",
      "paymentMethod",
      "razorpayOrderId",
      "razorpayPaymentId",
      "status",
      "createdAt",
    ],
  },
  {
    name: "payments",
    columns: [
      "id",
      "orderId",
      "customerId",
      "tailorId",
      "amount",
      "paymentMethod",
      "paymentStatus",
      "transactionId",
      "timestamp",
      "receiptUrl",
    ],
  },
  {
    name: "reviews",
    columns: [
      "id",
      "tailorId",
      "customerId",
      "customerName",
      "customerVillage",
      "rating",
      "comment",
      "date",
      "orderId",
    ],
  },
  {
    name: "tailors",
    columns: [
      "id",
      "userId",
      "name",
      "phone",
      "avatar",
      "state",
      "district",
      "village",
      "addressApprox",
      "bio",
      "experienceYears",
      "rating",
      "reviewCount",
      "completedOrdersCount",
      "availability",
      "maxActiveOrders",
      "currentActiveOrders",
      "servicesOffered",
      "startingPrice",
      "estCompletionDays",
      "skills",
      "galleryImages",
      "isVerified",
      "joinedDate",
    ],
  },
  {
    name: "users",
    columns: [
      "id",
      "name",
      "phone",
      "email",
      "role",
      "state",
      "district",
      "village",
      "avatar",
      "createdAt",
      "isVerified",
      "password",
      "isBlocked",
    ],
  },
];

function sqlType(column) {
  const integerColumns = new Set([
    "startingPrice",
    "estDays",
    "popular",
    "price",
    "isAvailable",
    "isRead",
    "amountPaise",
    "amount",
    "experienceYears",
    "reviewCount",
    "completedOrdersCount",
    "maxActiveOrders",
    "currentActiveOrders",
    "isVerified",
    "isBlocked",
    "advancePaid",
    "hasDeliveryAvailable",
    "rating",
  ]);

  if (integerColumns.has(column)) {
    return column === "rating" ? "DOUBLE PRECISION" : "INTEGER";
  }

  return "TEXT";
}

async function main() {
  console.log("Opening PostgreSQL connection...");
  await pg.connect();

  try {
    await pg.query("BEGIN");

    console.log("Creating PostgreSQL tables...");

    for (const table of tables) {
      const columns = table.columns
        .map((column) => `"${column}" ${sqlType(column)}`)
        .join(",\n  ");

      const primaryKey =
        table.name === "idempotency_records"
          ? ',\n  PRIMARY KEY ("scope", "idempotencyKey")'
          : table.name === "payment_intents"
            ? ',\n  PRIMARY KEY ("idempotencyKey")'
            : ',\n  PRIMARY KEY ("id")';

      await pg.query(`
        CREATE TABLE IF NOT EXISTS "${table.name}" (
          ${columns}
          ${primaryKey}
        )
      `);
    }

    console.log("PostgreSQL tables ready.");
    console.log("");

    for (const table of tables) {
      const rows = sqlite
        .prepare(`SELECT * FROM "${table.name}"`)
        .all();

      console.log(`Migrating ${table.name}: ${rows.length} rows`);

      if (rows.length === 0) {
        continue;
      }

      const columnList = table.columns
        .map((column) => `"${column}"`)
        .join(", ");

      const placeholders = table.columns
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const insertSql = `
        INSERT INTO "${table.name}" (${columnList})
        VALUES (${placeholders})
        ON CONFLICT DO NOTHING
      `;

      for (const row of rows) {
        const values = table.columns.map((column) => {
          const value = row[column];

          if (value === undefined) {
            return null;
          }

          return value;
        });

        await pg.query(insertSql, values);
      }
    }

    await pg.query("COMMIT");

    console.log("");
    console.log("========================================");
    console.log("Migration completed successfully.");
    console.log("========================================");
  } catch (error) {
    await pg.query("ROLLBACK");

    console.error("");
    console.error("Migration failed. Transaction rolled back.");
    console.error(error);

    process.exitCode = 1;
  } finally {
    sqlite.close();
    await pg.end();
  }
}

main();