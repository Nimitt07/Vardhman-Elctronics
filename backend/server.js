import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import pg from "pg";

const { Pool } = pg;
const envPath = new URL("./.env", import.meta.url);

if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  }
}

const PORT = Number(process.env.PORT || 8000);
const DATABASE_URL = process.env.DATABASE_URL;
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || "*").replace(/\/+$/, "");

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL. Add your Neon PostgreSQL connection string.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
});

const seedProducts = [
  ["Samsung Galaxy M55 5G", "Smartphones", 24999, 32999, 14, "📱", "A vivid AMOLED 5G smartphone with fast charging, a crisp camera system, and dependable all-day battery life.", 4.6, 842],
  ["Realme Narzo 70 Pro", "Smartphones", 18999, 23999, 22, "📲", "Smooth performance, sharp photos, and a premium glass finish built for daily entertainment and multitasking.", 4.4, 615],
  ["OnePlus Nord CE4", "Smartphones", 26999, 29999, 9, "📱", "Clean OxygenOS experience with a powerful processor, flagship-inspired design, and excellent charging speed.", 4.7, 1038],
  ["Dell Inspiron 15", "Laptops", 57990, 67990, 7, "💻", "Reliable Intel-powered laptop for work, study, browsing, and everyday productivity with a comfortable keyboard.", 4.5, 391],
  ["HP Pavilion x360", "Laptops", 71990, 82990, 5, "🖥️", "Flexible touchscreen laptop with 360-degree hinge, strong battery life, and a sleek portable build.", 4.3, 278],
  ["Lenovo IdeaPad Slim 5", "Laptops", 64990, 74990, 11, "💻", "Slim performance laptop with vibrant display, fast storage, and efficient thermal design for busy days.", 4.6, 507],
  ["boAt Airdopes 141", "Audio", 1299, 4490, 35, "🎧", "Compact true wireless earbuds with punchy bass, low-latency mode, and a pocket-friendly charging case.", 4.2, 3204],
  ["Sony WH-CH720N", "Audio", 8990, 14990, 13, "🎧", "Wireless noise cancelling headphones with balanced Sony audio, lightweight comfort, and long battery life.", 4.8, 1198],
  ["JBL Go 4 Speaker", "Audio", 3499, 4999, 18, "🔊", "Portable Bluetooth speaker with bold sound, durable build, and a compact body made for travel.", 4.4, 741],
  ["65W Fast Charger", "Accessories", 1499, 2499, 40, "🔌", "Universal fast charger for phones, tablets, and compatible laptops with intelligent safety protection.", 4.5, 902],
  ["Type-C Braided Cable", "Accessories", 399, 799, 64, "🔗", "Durable braided USB Type-C cable with quick charging support and reinforced connectors.", 4.1, 1367],
  ["Ambrane 20000mAh Power Bank", "Accessories", 2199, 3499, 24, "🔋", "High-capacity power bank with dual output, fast charging, and travel-ready safety protection.", 4.6, 1886],
];

function productRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    originalPrice: row.original_price,
    stock: row.stock,
    image: row.image,
    description: row.description,
    rating: Number(row.rating),
    reviews: row.reviews,
  };
}

function orderRow(row, items = []) {
  return {
    id: row.id,
    orderId: row.order_id,
    userId: row.user_id,
    username: row.username,
    total: row.total,
    status: row.status,
    date: row.created_at_label,
    deliveryAddress: row.delivery_address || null,
    items,
  };
}

function itemRow(row) {
  return {
    productId: row.product_id,
    name: row.name,
    price: row.price,
    quantity: row.quantity,
    image: row.image,
  };
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'user'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      rating NUMERIC(2, 1) NOT NULL,
      reviews INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_id TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id),
      username TEXT NOT NULL,
      total INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at_label TEXT NOT NULL,
      delivery_address JSONB
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      image TEXT NOT NULL
    );
  `);

  await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address JSONB");

  const usersCount = await pool.query("SELECT COUNT(*)::int AS count FROM users");
  if (usersCount.rows[0].count === 0) {
    await pool.query(
      "INSERT INTO users(username, password, role) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)",
      ["admin", "vardhman@admin", "admin", "rahul", "rahul123", "user", "priya", "priya123", "user"]
    );
  }

  const productsCount = await pool.query("SELECT COUNT(*)::int AS count FROM products");
  if (productsCount.rows[0].count === 0) {
    for (const product of seedProducts) {
      await pool.query(
        `
        INSERT INTO products(name, category, price, original_price, stock, image, description, rating, reviews)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        product
      );
    }
  }
}

function json(res, status, payload) {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": CLIENT_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function currentUser(req) {
  const id = req.headers["x-user-id"];
  if (!id) return null;
  const result = await pool.query("SELECT id, username, role FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function requireUser(req, res) {
  const user = await currentUser(req);
  if (!user) json(res, 401, { error: "Login required" });
  return user;
}

async function requireAdmin(req, res) {
  const user = await requireUser(req, res);
  if (!user) return null;
  if (user.role !== "admin") {
    json(res, 403, { error: "Access denied" });
    return null;
  }
  return user;
}

async function withItems(order) {
  const items = await pool.query("SELECT product_id, name, price, quantity, image FROM order_items WHERE order_id = $1", [order.order_id]);
  return orderRow(order, items.rows.map(itemRow));
}

function cleanProduct(body) {
  return {
    name: String(body.name || "").trim(),
    category: body.category || "Smartphones",
    price: Number(body.price || 0),
    originalPrice: Number(body.originalPrice || body.price || 0),
    stock: Number(body.stock || 0),
    image: body.image || "📦",
    description: String(body.description || "").trim(),
    rating: Number(body.rating || 4.4),
    reviews: Number(body.reviews || 0),
  };
}

function cleanAddress(body) {
  const address = body?.deliveryAddress || {};
  return {
    fullName: String(address.fullName || "").trim(),
    phone: String(address.phone || "").trim(),
    house: String(address.house || "").trim(),
    area: String(address.area || "").trim(),
    city: String(address.city || "").trim(),
    state: String(address.state || "").trim(),
    pincode: String(address.pincode || "").trim(),
    country: String(address.country || "").trim(),
  };
}

function validateAddress(address) {
  const required = ["fullName", "phone", "house", "area", "city", "state", "pincode", "country"];
  const missing = required.filter((key) => !address[key]);
  if (missing.length) return "Complete delivery address is required";
  if (!/^[0-9+\-\s]{8,15}$/.test(address.phone)) return "Enter a valid phone number";
  if (!/^[0-9]{5,8}$/.test(address.pincode)) return "Enter a valid PIN/postal code";
  return "";
}

function routeSegments(pathname) {
  return pathname.split("/").filter(Boolean);
}

async function handler(req, res) {
  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const parts = routeSegments(path);

  try {
    if (req.method === "GET" && path === "/api/health") {
      await pool.query("SELECT 1");
      json(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && path === "/api/products") {
      const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
      json(res, 200, result.rows.map(productRow));
      return;
    }

    if (req.method === "POST" && path === "/api/login") {
      const body = await readBody(req);
      const result = await pool.query(
        "SELECT id, username, role FROM users WHERE username = $1 AND password = $2",
        [String(body.username || "").trim(), body.password || ""]
      );
      if (!result.rows[0]) {
        json(res, 401, { error: "Wrong username or password" });
        return;
      }
      json(res, 200, { user: result.rows[0] });
      return;
    }

    if (req.method === "POST" && path === "/api/register") {
      const body = await readBody(req);
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      if (!username || password.length < 4) {
        json(res, 400, { error: "Username and 4+ character password required" });
        return;
      }
      try {
        const result = await pool.query(
          "INSERT INTO users(username, password, role) VALUES ($1, $2, 'user') RETURNING id, username, role",
          [username, password]
        );
        json(res, 201, { user: result.rows[0] });
      } catch (error) {
        if (error.code === "23505") {
          json(res, 409, { error: "Username already exists" });
          return;
        }
        throw error;
      }
      return;
    }

    if (req.method === "GET" && path === "/api/orders") {
      const user = await requireUser(req, res);
      if (!user) return;
      const result =
        user.role === "admin"
          ? await pool.query("SELECT * FROM orders ORDER BY id DESC")
          : await pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC", [user.id]);
      json(res, 200, await Promise.all(result.rows.map(withItems)));
      return;
    }

    if (req.method === "POST" && path === "/api/orders") {
      const user = await requireUser(req, res);
      if (!user) return;
      const body = await readBody(req);
      const items = Array.isArray(body.items) ? body.items : [];
      const deliveryAddress = cleanAddress(body);
      const addressError = validateAddress(deliveryAddress);
      if (items.length === 0) {
        json(res, 400, { error: "Cart is empty" });
        return;
      }
      if (addressError) {
        json(res, 400, { error: addressError });
        return;
      }

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const ordered = [];
        let subtotal = 0;

        for (const item of items) {
          const quantity = Number(item.quantity || 0);
          const productResult = await client.query("SELECT * FROM products WHERE id = $1 FOR UPDATE", [item.productId]);
          const product = productResult.rows[0];
          if (!product || quantity <= 0) {
            await client.query("ROLLBACK");
            json(res, 400, { error: "Invalid cart item" });
            return;
          }
          if (product.stock < quantity) {
            await client.query("ROLLBACK");
            json(res, 409, { error: `Only ${product.stock} left for ${product.name}` });
            return;
          }
          ordered.push({ product, quantity });
          subtotal += product.price * quantity;
        }

        const orderId = `VE-${Date.now().toString().slice(-8)}`;
        const total = Math.round(subtotal * 1.18);
        const createdAtLabel = new Intl.DateTimeFormat("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date());

        const orderResult = await client.query(
          "INSERT INTO orders(order_id, user_id, username, total, status, created_at_label, delivery_address) VALUES ($1, $2, $3, $4, 'Pending', $5, $6::jsonb) RETURNING *",
          [orderId, user.id, user.username, total, createdAtLabel, JSON.stringify(deliveryAddress)]
        );

        for (const { product, quantity } of ordered) {
          await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [quantity, product.id]);
          await client.query(
            "INSERT INTO order_items(order_id, product_id, name, price, quantity, image) VALUES ($1, $2, $3, $4, $5, $6)",
            [orderId, product.id, product.name, product.price, quantity, product.image]
          );
        }

        await client.query("COMMIT");
        json(res, 201, await withItems(orderResult.rows[0]));
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
      return;
    }

    if (req.method === "GET" && path === "/api/users") {
      if (!(await requireAdmin(req, res))) return;
      const result = await pool.query("SELECT id, username, role FROM users ORDER BY id");
      json(res, 200, result.rows);
      return;
    }

    if (req.method === "GET" && path === "/api/stats") {
      if (!(await requireAdmin(req, res))) return;
      const [products, orders, users, revenue] = await Promise.all([
        pool.query("SELECT COUNT(*)::int AS count FROM products"),
        pool.query("SELECT COUNT(*)::int AS count FROM orders"),
        pool.query("SELECT COUNT(*)::int AS count FROM users"),
        pool.query("SELECT COALESCE(SUM(total), 0)::int AS total FROM orders WHERE status = 'Delivered'"),
      ]);
      json(res, 200, {
        products: products.rows[0].count,
        orders: orders.rows[0].count,
        users: users.rows[0].count,
        revenue: revenue.rows[0].total,
      });
      return;
    }

    if (req.method === "POST" && path === "/api/products") {
      if (!(await requireAdmin(req, res))) return;
      const product = cleanProduct(await readBody(req));
      if (!product.name || !product.description || product.price <= 0 || product.stock < 0) {
        json(res, 400, { error: "Please complete product details" });
        return;
      }
      const result = await pool.query(
        `
        INSERT INTO products(name, category, price, original_price, stock, image, description, rating, reviews)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [product.name, product.category, product.price, product.originalPrice, product.stock, product.image, product.description, product.rating, product.reviews]
      );
      json(res, 201, productRow(result.rows[0]));
      return;
    }

    if (req.method === "PUT" && parts[0] === "api" && parts[1] === "products" && parts[2]) {
      if (!(await requireAdmin(req, res))) return;
      const product = cleanProduct(await readBody(req));
      const result = await pool.query(
        `
        UPDATE products
        SET name = $1, category = $2, price = $3, original_price = $4, stock = $5, image = $6, description = $7, rating = $8, reviews = $9
        WHERE id = $10
        RETURNING *
        `,
        [product.name, product.category, product.price, product.originalPrice, product.stock, product.image, product.description, product.rating, product.reviews, parts[2]]
      );
      json(res, result.rows[0] ? 200 : 404, result.rows[0] ? productRow(result.rows[0]) : { error: "Product not found" });
      return;
    }

    if (req.method === "DELETE" && parts[0] === "api" && parts[1] === "products" && parts[2]) {
      if (!(await requireAdmin(req, res))) return;
      await pool.query("DELETE FROM products WHERE id = $1", [parts[2]]);
      json(res, 200, { ok: true });
      return;
    }

    if (req.method === "PATCH" && parts[0] === "api" && parts[1] === "orders" && parts[3] === "status") {
      if (!(await requireAdmin(req, res))) return;
      const body = await readBody(req);
      if (!["Pending", "Confirmed", "Shipped", "Delivered"].includes(body.status)) {
        json(res, 400, { error: "Invalid status" });
        return;
      }
      const result = await pool.query("UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *", [body.status, parts[2]]);
      json(res, result.rows[0] ? 200 : 404, result.rows[0] ? orderRow(result.rows[0]) : { error: "Order not found" });
      return;
    }

    json(res, 404, { error: "Not found" });
  } catch (error) {
    console.error(error);
    json(res, 500, { error: error.message });
  }
}

await initDb();
createServer(handler).listen(PORT, () => {
  console.log(`Vardhman Electronics API running on port ${PORT}`);
});
