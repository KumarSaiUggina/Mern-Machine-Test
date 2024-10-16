const mongoose = require("mongoose");
const Counter = require("./Counter"); // Import the Counter model

const employeeSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: Number,
      unique: true, // ensures that the UNIQUE_ID is unique
    },
    image: {
      type: Buffer, // Assuming you're storing the image as a buffer
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ensures that the email is unique
    },
    mobile: {
      type: Number,
      required: true,
    },
    designation: {
      type: [String], // Array of designations
      enum: ["Manager", "HR", "Sales"], // Possible designations
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // limiting the values for gender
      required: true,
    },
    courses: {
      type: [String], // Array of courses
      enum: ["BCA", "MCA", "BSC"], // Possible courses
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now, // Automatically set the date when an employee is created
    },
  },
  { collation: { locale: 'en', strength: 1 } } // Correct collation definition
);

// Pre-save hook to set the uniqueId and createdDate automatically
employeeSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Increment the uniqueId
      const counter = await Counter.findOneAndUpdate(
        {}, // Find the first document
        { $inc: { sequenceValue: 1 } }, // Increment the sequence value
        { new: true, upsert: true } // Create if it doesn't exist
      );

      // Ensure the uniqueId is 5 digits
      this.uniqueId = counter.sequenceValue.toString().padStart(5, "0");

      // Automatically set createdDate if it's not already set
      if (!this.createdDate) {
        this.createdDate = Date.now();
      }

      next();
    } catch (err) {
      next(err); // Pass error to the next middleware
    }
  } else {
    next(); // If not a new document, just proceed
  }
});

// Create a model from the schema
const EmployeeModel = mongoose.model("employee", employeeSchema);

module.exports = EmployeeModel;
