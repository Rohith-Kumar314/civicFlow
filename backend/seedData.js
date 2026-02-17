// seedData.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker"); // npm install @faker-js/faker

// MODELS (your actual paths)
const User = require("./models/User");
const AdminProfile = require("./models/AdminProfile");
const ResidentProfile = require("./models/ResidentProfiles");
const WorkerProfile = require("./models/WorkerProfile");
const Building = require("./models/Building");
const Complaint = require("./models/Complaint");

// 🔧 CHANGE THIS IF NEEDED
const MONGO_URI = "mongodb://127.0.0.1:27017/civicFlow";

const departments = ["Electrician", "Plumber", "Carpenter", "Technical", "Other"];

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB Connected");
}

async function clearDB() {
  await Promise.all([
    User.deleteMany({}),
    AdminProfile.deleteMany({}),
    ResidentProfile.deleteMany({}),
    WorkerProfile.deleteMany({}),
    Building.deleteMany({}),
    Complaint.deleteMany({}),
  ]);
  console.log("🧹 Database cleared");
}

async function createBuildings() {
  const buildings = await Building.insertMany([
    { block: "A", totalFloors: 6, roomsPerFloor: 8 },
    { block: "B", totalFloors: 5, roomsPerFloor: 6 },
    { block: "C", totalFloors: 7, roomsPerFloor: 5 },
  ]);

  console.log(`🏢 Created ${buildings.length} buildings`);
  return buildings;
}

async function createAdmin() {
  const password = await bcrypt.hash("admin@2025", 10);

  const adminUser = await User.create({
    username: "admin_rohith",
    email: "admin@civicflow.in",
    password,
    role: "admin",
  });

  await AdminProfile.create({
    user: adminUser._id,
    contactNumber: "9849123456",
  });

  console.log("👮 Admin created");
}

async function createWorkers() {
  const workers = [];
  const firstNames = ["Rahul", "Priya", "Vikram", "Sneha", "Arjun", "Neha", "Karthik", "Ananya"];
  const lastNames = ["Sharma", "Patel", "Reddy", "Kumar", "Nair", "Singh", "Gupta", "Iyer"];

  for (let i = 0; i < 6; i++) {
    const fname = firstNames[i];
    const lname = lastNames[i];

    const password = await bcrypt.hash("worker@123", 10);

    const user = await User.create({
      username: `${fname.toLowerCase()}_${lname.toLowerCase()}`,
      email: `${fname.toLowerCase()}.${lname.toLowerCase()}@civicflow.in`,
      password,
      role: "worker",
    });

    const profile = await WorkerProfile.create({
      user: user._id,
      department: departments[i % departments.length],
      assignedBlocks: i % 2 === 0 ? ["A", "B"] : ["B", "C"],
      contactNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
    });

    workers.push({ user, profile });
  }

  console.log(`🧑‍🔧 Created ${workers.length} workers`);
  return workers;
}

async function createResidents(buildings) {
  const residents = [];
  let count = 1;

  for (const building of buildings) {
    for (let floor = 1; floor <= building.totalFloors; floor++) {
      for (let room = 1; room <= building.roomsPerFloor; room++) {
        // Skip ~35% rooms → realistic vacancy (~65% occupancy)
        if (Math.random() < 0.35) continue;

        const password = await bcrypt.hash("resident@123", 10);

        const fname = faker.person.firstName();
        const lname = faker.person.lastName();

        const user = await User.create({
          username: `${fname.toLowerCase()}.${lname.toLowerCase()}${count}`,
          email: `${fname.toLowerCase()}.${lname.toLowerCase()}@gmail.com`,
          password,
          role: "resident",
        });

        await ResidentProfile.create({
          user: user._id,
          block: building.block,
          floor,
          roomNumber: room,
          contactNumber: `8${Math.floor(100000000 + Math.random() * 900000000)}`,
        });

        residents.push({
          user,
          block: building.block,
          floor,
          roomNumber: room,
        });

        count++;
      }
    }
  }

  console.log(`🏠 Created ${residents.length} residents (~65% occupancy)`);
  return residents;
}

async function createComplaints(residents, workers) {
  const complaints = [];

  const titles = [
    "No hot water in bathroom",
    "Ceiling fan making noise",
    "Kitchen tap leaking",
    "AC not cooling",
    "Electrical switch sparking",
    "Toilet flush not working",
    "Wall crack near window",
    "Main door lock jammed",
    "Tube light flickering",
    "Water seepage from ceiling",
    "Lift out of service",
    "Geyser not heating water",
    "Window glass broken",
    "Exhaust fan not working",
    "Bathroom light not turning on",
  ];

  const descriptions = [
    "This has been an issue for the past 3 days. Please resolve urgently.",
    "Very noisy at night, disturbing sleep.",
    "Water wastage is happening continuously.",
    "Room temperature is too high even after setting low.",
    "Safety hazard – please check immediately.",
    "Unable to use toilet properly since yesterday.",
    "Crack is widening slowly, concerned about structure.",
    "Cannot lock the door properly.",
    "Flickering is giving headache.",
    "Ceiling is wet, risk of short circuit.",
    "Stuck between floors yesterday.",
    "No hot water for bathing in morning.",
  ];

  for (let i = 0; i < 45; i++) {
    const resident = residents[Math.floor(Math.random() * residents.length)];
    const shouldAssign = Math.random() > 0.30; // ~70% assigned
    const worker = shouldAssign ? workers[Math.floor(Math.random() * workers.length)] : null;

    const statusOptions = ["Pending", "Accepted", "In Progress", "Completed"];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

    let acceptedAt = null;
    let completedAt = null;

    if (status !== "Pending") {
      acceptedAt = new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000); // within last 20 days
    }
    if (status === "Completed") {
      completedAt = new Date(acceptedAt.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000); // 0–10 days after accept
    }

    complaints.push({
      resident: resident.user._id,
      worker: worker ? worker.user._id : null,
      department: worker
        ? worker.profile.department
        : departments[Math.floor(Math.random() * departments.length)], // safe fallback
      title: titles[i % titles.length],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      block: resident.block,
      floor: resident.floor,
      roomNumber: resident.roomNumber,
      status,
      acceptedAt,
      completedAt,
      createdAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000), // within last 45 days
    });
  }

  await Complaint.insertMany(complaints);
  console.log(`📣 Created ${complaints.length} realistic complaints`);
}

async function seed() {
  try {
    await connectDB();
    await clearDB();

    const buildings = await createBuildings();
    await createAdmin();
    const workers = await createWorkers();
    const residents = await createResidents(buildings);
    await createComplaints(residents, workers);

    console.log("\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY");
    console.log(`• Admin: 1`);
    console.log(`• Workers: ${workers.length}`);
    console.log(`• Residents: ${residents.length}`);
    console.log(`• Buildings: ${buildings.length}`);
    console.log(`• Complaints: ${await Complaint.countDocuments()}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  }
}

seed();