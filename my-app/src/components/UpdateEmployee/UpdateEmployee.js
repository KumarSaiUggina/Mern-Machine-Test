import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import classes from "./UpdateEmployee.module.css";

const UpdateEmployee = () => {
  const { id } = useParams(); // Retrieve uniqueId from the URL

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
  axios.defaults.withCredentials = true; // default

  useEffect(() => {
    axios
      .get(`https://mern-stack-crud-project-lime.vercel.app/updateEmployee/${id}`)
      .then((result) => {
        const data = result.data;
        // Ensure courses is always an array
        setFormData({
          ...data,
          courses: data.courses || [], // If courses is undefined, fallback to an empty array
        });
        if (data.image) {
          setPreviewImage(data.image); // Set the preview image if it exists
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Converts file to base64
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prevData) => ({ ...prevData, image: reader.result }));
      };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://mern-stack-crud-project-lime.vercel.app/updateEmployee/${id}`,
        formData
      );
      console.log("Employee updated successfully:", response.data);
      setIsSubmitted(true); // Set submission state to true
      alert("Employee updated successfully");
      navigate("/employeeList"); // Redirect to employee list page after successful update
    } catch (error) {
      console.error("Error updating employee:", error);
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
      <h1>Update Employee</h1>
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
          <label className={classes.controlsCheckboxlabel} htmlFor="courses">
            Courses
          </label>
          <label className={classes["checkbox-label"]}>
            <input
              type="checkbox"
              name="courses"
              value="MCA"
              checked={formData.courses.includes("MCA")}
              onChange={handleCheckboxChange}
            />
            <span className={classes["custom-checkbox"]}>MCA</span>
          </label>
          <label className={classes["checkbox-label"]}>
            <input
              type="checkbox"
              name="courses"
              value="BCA"
              checked={formData.courses.includes("BCA")}
              onChange={handleCheckboxChange}
            />
            <span className={classes["custom-checkbox"]}>BCA</span>
          </label>
          <label className={classes["checkbox-label"]}>
            <input
              type="checkbox"
              name="courses"
              value="BSC"
              checked={formData.courses.includes("BSC")}
              onChange={handleCheckboxChange}
            />
            <span className={classes["custom-checkbox"]}>BSC</span>
          </label>
        </div>

        <div className={classes.controlsImageUpload}>
          <label htmlFor="image">Img Upload</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage && (
            <div className={classes.previewContainer}>
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          )}
        </div>

        <div className={classes.actions}>
          <button type="submit">Update Employee</button>
        </div>
      </form>
    </section>
  );
};

export default UpdateEmployee;
