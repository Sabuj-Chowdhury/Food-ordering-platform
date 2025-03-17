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

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: userData.email,
          name: userData.displayName,
          photo: userData.photoURL,
          role: "user",
          created_at: new Date(),
          last_sign_in: new Date(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

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

// check if a user is admin
app.get("/user/admin/:email", verifyToken, async (req, res) => {
  try {
    const email = req.params.email;

    const { data: user, error } = await supabase
      .from("users")
      .select("role")
      .eq("email", email)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        admin: false,
        message: "User not found",
      });
    }

    const isAdmin = user?.role === "admin";
    res.json({
      success: true,
      admin: isAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      admin: false,
      message: "Error checking admin status",
      error: error.message,
    });
  }
});

// Get all users endpoint with pagination
app.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .range(start, start + limit - 1)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      users: data,
      totalUsers: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
      success: false,
    });
  }
});

// Get single user data
app.get("/users/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    console.log("Fetching user data for:", email); // Debug log

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.log("Supabase error:", error); // Debug log
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("Found user data:", data); // Debug log
    res.status(200).json({
      success: true,
      user: data
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`FoodZone is running on port ${port}`);
});
