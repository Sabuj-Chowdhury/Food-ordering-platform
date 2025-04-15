require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");
const app = express();
const port = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// token verify middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token received:", token);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      console.log("Verification error:", err);
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

// JWT generation route
app.post("/jwt", async (req, res) => {
  try {
    const user = req.body;
    console.log("Generating token for:", user);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
      expiresIn: "24h",
    });
    // console.log("Generated token:", token); // Add this log
    res.send({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({
      message: "Error generating token",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from FoodZone Server..");
});

// admin verify middleware
const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded.email;

    const { data: user, error } = await supabase
      .from("users")
      .select("role")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(404).send({ message: "User not found!" });
    }

    const isAdmin = user.role === "admin";
    if (!isAdmin) {
      return res.status(403).send({ message: "forbidden access!" });
    }
    next();
  } catch (error) {
    res.status(500).send({ message: "Error verifying admin status" });
  }
};

// User registration endpoint
app.post("/users", async (req, res) => {
  try {
    const userData = req.body;
    // console.log("Received user data:", userData); // Add this debug log

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", userData.email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // Insert new user with error logging
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: userData.email,
          name: userData.displayName,
          photo: userData.photoURL,
          role: "user",
          created_at: new Date().toISOString(), // Fix the date format
          last_sign_in: new Date().toISOString(), // Fix the date format
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insertion error:", error); // Add detailed error logging
      throw error;
    }

    res.status(201).json({
      message: "User created successfully",
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
      success: false,
    });
  }
});

// Get all users except the one with the given email
app.get("/users/admin/:email", verifyToken, verifyAdmin, async (req, res) => {
  const excludedEmail = req.params.email;

  const { data, count } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .neq("email", excludedEmail)
    .order("created_at", { ascending: false });

  res.send({
    users: data,
    totalUsers: count,
  });
});

// Update user role and set status to "approved"
app.patch(
  "/users/update-role/:email",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const { email } = req.params;
    const { role } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({
        role: role,
        status: "approved",
      })
      .eq("email", email)
      .select();

    res.send({
      success: !error,
      message: error ? "Failed to update user" : "User updated successfully",
      user: data?.[0],
    });
  }
);

// Get single user data
app.get("/users/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    // console.log("Fetching user data for:", email); // Debug log

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.log("Supabase error:", error); // Debug log
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Found user data:", data); // Debug log
    res.status(200).json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error.message,
    });
  }
});

// get user role
app.get("/users/role/:email", verifyToken, async (req, res) => {
  const { email } = req.params;

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.status(404).json({
      success: false,
      message: "User not found or error retrieving role",
    });
  }

  res.status(200).json({
    role: data.role,
  });
});

// manage user status
app.patch("/users/status/:email", verifyToken, async (req, res) => {
  const email = req.params.email;

  const { data: user } = await supabase
    .from("users")
    .select("status")
    .eq("email", email)
    .single();

  if (user?.status === "requested") {
    return res.json({
      message: "Request already submitted",
      alreadyRequested: true,
    });
  }

  await supabase
    .from("users")
    .update({ status: "requested" })
    .eq("email", email);

  res.json({
    message: "Request submitted successfully",
    alreadyRequested: false,
  });
});

// Update user profile
app.patch("/users/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({
        name: updateData.name,
        photo: updateData.photo,
        phone: updateData.phone,
        address: updateData.address,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)
      .select("*");

    if (error) {
      console.error("Update error:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to update user",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: data[0],
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
});

// Add restaurant to DB
app.post("/restaurants", verifyToken, async (req, res) => {
  try {
    const restaurant = req.body;

    const { data, error } = await supabase
      .from("restaurants")
      .insert([
        {
          name: restaurant.name,
          owner: restaurant.owner,
          phone: restaurant.phone,
          address: restaurant.address,
          cuisine: restaurant.cuisine,
          image: restaurant.image,
          email: restaurant.email,
          created_at: restaurant.createdAt,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting restaurant:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to save restaurant",
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Restaurant added successfully",
      restaurant: data,
    });
  } catch (err) {
    console.error("Unexpected error while saving restaurant:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while saving the restaurant",
      error: err.message,
    });
  }
});

// get all restaurants data by user email
app.get("/restaurants/owner/:email", verifyToken, async (req, res) => {
  const { email } = req.params;

  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("email", email);

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ error: "Failed to fetch restaurants" });
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No restaurants found for this email" });
    }

    res.status(200).json({ restaurants: data });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete restaurant
app.delete("/restaurants/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("restaurants").delete().eq("id", id);

  if (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting restaurant",
      error: error.message,
    });
  }

  res.status(200).json({
    success: true,
    message: "Restaurant deleted",
  });
});

// Get all restaurants (public view)
app.get("/api/public/restaurants", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("id, name, image, cuisine, address");

    if (error) {
      console.error("🔥 Supabase error:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch restaurants." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("🔥 Server error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// GET /api/public/restaurant/:id/menu
app.get("/api/public/restaurant/:id/menu", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("restaurants")
    .select(
      `
      id,
      name,
      address,
      image,
      cuisine,
      phone,
      email,
      menu (
        id,
        name,
        description,
        price,
        category,
        image
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  if (!data) {
    return res
      .status(404)
      .json({ success: false, message: "Restaurant not found" });
  }

  res.json(data);
});

// Add a menu in the database
app.post("/menu", verifyToken, async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    image,
    restaurant_id,
    owner_email,
  } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !image ||
    !restaurant_id ||
    !owner_email
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields." });
  }

  const { error } = await supabase.from("menu").insert([
    {
      name,
      description,
      price,
      category,
      image,
      restaurant_id,
      owner_email,
    },
  ]);

  if (error) {
    console.error("🔥 Supabase insert error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }

  res.json({ success: true, message: "Menu item added successfully!" });
});

// get all menu items for that user
// Get menu items by owner email and include restaurant name
app.get("/menu/:email", verifyToken, async (req, res) => {
  const { email } = req.params;

  const { data, error } = await supabase
    .from("menu")
    .select(
      `
      id,
      name,
      description,
      price,
      category,
      image,
      restaurant_id,
      restaurants (
        name
      )
    `
    )
    .eq("owner_email", email);

  if (error) {
    console.error("Supabase JOIN error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch menu" });
  }

  // 💡 Rename the restaurant name to avoid conflict with menu name
  const formatted = data.map((item) => ({
    ...item,
    food_name: item.name, // menu item name
    restaurant_name: item.restaurants?.name || "Unknown",
  }));

  res.json(formatted);
});

// Get a single menu item
app.get("/menu/item/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("menu")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// Update menu item
app.patch("/menu/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const { error } = await supabase.from("menu").update(updateData).eq("id", id);
  if (error)
    return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true });
});

// DELETE menu item by ID
app.delete("/menu/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("menu").delete().eq("id", id);

  if (error) {
    console.error("❌ Delete menu error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }

  res.json({ success: true, message: "Menu item deleted successfully." });
});

// cod order save in the db
app.post("/api/order", async (req, res) => {
  const {
    user_email,
    user_name,
    user_phone,
    user_address,
    cart,
    total,
    paymentMethod,
  } = req.body;

  // Validation
  if (
    !user_email ||
    !user_name ||
    !user_phone ||
    !user_address ||
    !Array.isArray(cart) ||
    !total ||
    !paymentMethod
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
  }

  try {
    // Prepare order object
    const orderData = {
      user_email,
      user_name,
      user_phone,
      user_address,
      items: cart, // save full cart as JSON
      total,
      payment_method: paymentMethod,
      payment_status: paymentMethod === "cod" ? "pending" : "paid", // SSL will update later
      order_status: "pending", // can later be updated by seller/admin
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error("❌ Error placing order:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }

    // 🔁 Optional: Update popularity count for each menu item
    for (const item of cart) {
      if (item.id) {
        await supabase.rpc("increment_menu_count", { menu_id_input: item.id });
      }
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: data,
    });
  } catch (err) {
    console.error("🔥 Server error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// get order data for user
app.get("/api/orders/user/:email", async (req, res) => {
  const { email } = req.params;

  console.log("Fetching orders for email:", email);

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      orders: data || [],
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

// get order data for seller
app.get("/api/orders/seller/:email", async (req, res) => {
  const { email } = req.params;

  console.log("📦 Fetching orders for seller:", email);

  try {
    const { data: allOrders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }

    const sellerOrders = allOrders
      .map((order) => {
        if (!Array.isArray(order.items)) return null;

        const sellerItems = order.items.filter(
          (item) => item.ownerEmail === email // 🔥 Corrected here
        );

        if (sellerItems.length === 0) return null;

        return {
          ...order,
          items: sellerItems,
          total: sellerItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ),
        };
      })
      .filter(Boolean);

    console.log("✅ Filtered orders:", sellerOrders);

    res.json({ success: true, orders: sellerOrders });
  } catch (err) {
    console.error("🔥 Server error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// order status update /patch
// Update order status
app.patch("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // 1. Fetch current order data
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("payment_method, payment_status, order_status")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("❌ Fetch error:", fetchError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch order",
        error: fetchError.message,
      });
    }

    // 2. Prepare updates
    const updates = {
      order_status: status,
    };

    if (
      status === "delivered" &&
      order.payment_method === "cod" &&
      order.payment_status === "pending"
    ) {
      updates.payment_status = "paid";
    }

    // 3. Update the order
    const { error: updateError } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      console.error("❌ Update status error:", updateError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to update order status",
        error: updateError.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (err) {
    console.error("🔥 Server error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`FoodZone is running on port ${port}`);
});
