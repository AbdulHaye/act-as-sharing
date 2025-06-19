const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../src/config/db");
const Tenant = require("../src/services/tenant-service/models/Tenant");

// Load environment variables
dotenv.config();

// Verify Tenant model
if (!Tenant || typeof Tenant.deleteMany !== "function") {
  console.error(
    "Error: Tenant model is not properly defined. Check import path or model export."
  );
  process.exit(1);
}

// Sample tenant data
const tenants = [
  {
    name: "Test Tenant Local",
    domains: ["localhost:5000"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Tenant One",
    domains: ["tenant1.commonchange.com"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Tenant Two",
    domains: ["tenant2.commonchange.com"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Seeder function
const seedTenants = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing tenants
    await Tenant.deleteMany({});
    console.log("Existing tenants cleared");

    // Insert new tenants
    await Tenant.insertMany(tenants);
    console.log("Tenants seeded successfully");

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding tenants:", error.message);
    process.exit(1);
  }
};

// Run the seeder
seedTenants();
