import React, { useState, useEffect } from "react";
import { Link, } from "react-router-dom";
import axios from "axios";
import classes from "./EmployeeList.module.css";
import image from "../../assets/IMG_20220809_211400_484.jpg"; // Placeholder image

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("https://mern-stack-crud-project-lime.vercel.app/employeeList");
        setEmployees(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employees.");
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    const { uniqueId, name, email, mobile, createdDate } = employee;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const formattedDate = new Date(createdDate).toLocaleDateString();

    return (
      uniqueId.toString().includes(lowerCaseSearchTerm) ||
      name.toLowerCase().includes(lowerCaseSearchTerm) ||
      email.toLowerCase().includes(lowerCaseSearchTerm) ||
      mobile.toString().includes(lowerCaseSearchTerm) ||
      formattedDate.includes(lowerCaseSearchTerm)
    );
  });

  // const handleEditClick = (employee) => {
  //   // Navigate to createEmployee with employee details
  //   navigate('/createEmployee', { state: { employee } });
  // };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`https://mern-stack-crud-project-lime.vercel.app/employeeList/${id}`); // Send delete request to the server
        setEmployees(employees.filter((employee) => employee._id !== id)); // Update local state
      } catch (err) {
        console.error("Error deleting employee:", err);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className={classes.auth}>
      <div>
        <div className={classes.container1}>
          <div>
            <h1>Employee List</h1>
          </div>
          <div>
            {`Total Count: ${filteredEmployees.length}`}
            <Link to={'/createEmployee'}>
              <button>Create Employee</button>
            </Link>
          </div>
        </div>
        <div className={classes.control}>
          <label htmlFor="search">Search</label>
          <input
            type="text"
            placeholder="Enter Search Keyword..."
            className={classes.searchInput}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <table className={classes.result}>
        <thead>
          <tr>
            <th>UNIQUE_ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No.</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.uniqueId}</td>
              <td>
                <img
                  src={employee.image ? `data:image/png;base64,${employee.image}` : image}
                  alt={employee.name}
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td>
              <td>{employee.designation.join(', ')}</td>
              <td>{employee.gender}</td>
              <td>{employee.courses.join(', ')}</td>
              <td>{new Date(employee.createdDate).toLocaleDateString()}</td>
              <td className={classes.actions}>
                <Link to={`/updateEmployee/${employee._id}`} >Update</Link>
                <button onClick={() => handleDeleteClick(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EmployeeList;
