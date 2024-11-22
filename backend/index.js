const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const UserModel = require("./models/Users");
const EmployeeModel = require("./models/Employee");

const app = express();
app.use(cors(
  {
    origin: ["https://deploy-mern-1whq.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  }
));

// Set body size limits (e.g., 50MB)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

mongoose
  .connect(
    "mongodb+srv://ugginakumarsai:kumarsai@newdatabase.0ccme0h.mongodb.net/?retryWrites=true&w=majority&appName=newDataBase",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected!"))
  .catch(err => console.error("Database connection error:", err));

// Login endpoint
app.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
});

app.post("/createEmployee", (req, res) => {
  EmployeeModel.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json({ message: err.message }));
});

app.get("/employeeList", async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    const formattedEmployees = employees.map((employee) => ({
      ...employee._doc,
      image: employee.image ? employee.image.toString("base64") : null,
    }));
    res.json(formattedEmployees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

app.get("/updateEmployee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee data", error });
  }
});

app.delete("/employeeList/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await EmployeeModel.findByIdAndDelete(id);
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
});

// Updated PUT route for updating an employee
app.put("/updateEmployee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the update respects the model's schema
    });
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
});

const port = process.env.PORT || "3001";
app.listen(port, (err) => {
  if (err) throw err;
  console.log("Server listening on port", port);
});
