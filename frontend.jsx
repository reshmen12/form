import React, { useState } from 'react';
import axios from 'axios';

const Frontend = () => {
  const [formData, setFormData] = useState({
    EmployeeID: '',
    Name: '',
    Email: '',
    PhoneNumber: '',
    Department: '',
    DateOfJoining: '',
    Role: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.EmployeeID || formData.EmployeeID.length > 10)
      newErrors.EmployeeID = 'Employee ID must be <= 10 characters';
    if (!formData.Email.includes('@')) newErrors.Email = 'Valid Email is required';
    if (formData.PhoneNumber.length !== 10) newErrors.PhoneNumber = 'Phone number must be 10 digits';
    if (!formData.Department) newErrors.Department = 'Department is required';
    if (!formData.DateOfJoining || new Date(formData.DateOfJoining) > new Date())
      newErrors.DateOfJoining = 'Date cannot be in the future';
    if (!formData.Role) newErrors.Role = 'Role is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const res = await axios.post('http://localhost:5000/employees', formData);
        setMessage(res.data.message);
        setErrors({});
        handleReset();
      } catch (err) {
        setMessage(err.response?.data?.message || 'Submission failed');
      }
    }
  };

  const handleReset = () => {
    // Reset the form data and errors
    setFormData({
      EmployeeID: '',
      Name: '',
      Email: '',
      PhoneNumber: '',
      Department: '',
      DateOfJoining: '',
      Role: '',
    });
    setErrors({});
    setMessage('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">Add Employee</h1>

        {message && <div className="text-green-500 text-center mb-4">{message}</div>}

        {Object.keys(formData).map((key) => (
          <div key={key} className="flex items-center space-x-4">
            <label
              htmlFor={key}
              className="w-1/3 text-gray-600 font-medium capitalize text-right"
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </label>
            <input
              id={key}
              type={key === 'DateOfJoining' ? 'date' : 'text'}
              placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
              value={formData[key]}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className={`w-2/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors[key] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="w-full py-2 px-4 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400 transition"
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default Frontend;
