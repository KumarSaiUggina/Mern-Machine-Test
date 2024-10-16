import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./CreateEmployee.module.css";
import axios from "axios";

const CreateEmployee = () => {
  // Define initial form state directly in useState
  const [formData, setFormData] = useState({
    uniqueId: "",
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    courses: [],
    image: null,
  });
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // State to trigger re-render

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      courses: checked
        ? [...prevData.courses, value]
        : prevData.courses.filter((course) => course !== value),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 5 * 1024 * 1024
    ) {
      // Limit size to 5MB
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prevData) => ({ ...prevData, image: reader.result }));
      };
    } else {
      alert("Please select a valid image file smaller than 5MB.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const employeeId = `EMP-${Date.now()}`; // Example unique ID generation
    try {
      const response = await axios.post(
        "http://localhost:3001/createEmployee",
        {
          ...formData,
          // uniqueId: employeeId,
        }
      );
      console.log("Employee created successfully:", response.data);
      setIsSubmitted(true);
      alert("Employee created successfully");
      navigate("/employeeList");
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };
  // Reset form and preview on submission
  React.useEffect(() => {
    if (isSubmitted) {
      setFormData({
        uniqueId: "",
        name: "",
        email: "",
        mobile: "",
        designation: "",
        gender: "",
        courses: [],
        image: null,
      });
      setPreviewImage(null);
      setIsSubmitted(false); // Reset submission state
    }
  }, [isSubmitted]);

  return (
    <section className={classes.auth}>
      <h1>Create Employee</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={classes.control}>
          <label htmlFor="mobile">Mobile No</label>
          <input
            type="number"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div className={classes.controls}>
          <label htmlFor="designation">Designation </label>
          <select
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select your Designation
            </option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <div className={classes.controlsradio}>
          <label className={classes.controlsradiolabel}>Gender</label>

          <label className={classes["radio-label"]}>
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleChange}
              checked={formData.gender === "Male"}
            />
            <span className={classes["custom-radio"]}>Male</span>
          </label>

          <label className={classes["radio-label"]}>
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleChange}
              checked={formData.gender === "Female"}
            />
            <span className={classes["custom-radio"]}>Female</span>
          </label>
        </div>

        <div className={classes.controlsCheckbox}>
          <label className={classes.controlsCheckboxlabel}>Courses</label>

          <label className={classes["checkbox-label"]}>
            <input
              type="checkbox"
              name="courses"
              value="MCA"
              onChange={handleCheckboxChange}
              checked={formData.courses.includes("MCA")}
            />
            <span className={classes["custom-checkbox"]}>MCA</span>
          </label>

          <label className={classes["checkbox-label"]}>
            <input
              type="checkbox"
              name="courses"
              value="BCA"
              onChange={handleCheckboxChange}
              checked={formData.courses.includes("BCA")}
            />
            <span className={classes["custom-checkbox"]}>BCA</span>
          </label>

          <label className={classes["checkbox-label"]}>
            <input
              type="checkbox"
              name="courses"
              value="BSC"
              onChange={handleCheckboxChange}
              checked={formData.courses.includes("BSC")}
            />
            <span className={classes["custom-checkbox"]}>BSC</span>
          </label>
        </div>

        <div className={classes.controlsImageUpload}>
          <label htmlFor="imageUpload">Img Upload</label>
          <input
            type="file"
            id="imageUpload"
            name="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage && (
            <div className={classes.previewContainer}>
              <img
                src={previewImage}
                alt="Selected Preview"
                className={classes.previewImage}
              />
            </div>
          )}
        </div>

        <div className={classes.actions}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </section>
  );
};

export default CreateEmployee;
