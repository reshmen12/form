import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { body, validationResult } from 'express-validator';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'RESHmen#8085',
  database: 'emp',
});

// API to add employee
app.post(
  '/employees',
  [
    body('EmployeeID')
      .isAlphanumeric()
      .isLength({ max: 10 })
      .withMessage('Employee ID must be alphanumeric and <= 10 characters'),
    body('Email').isEmail().withMessage('Invalid email format'),
    body('PhoneNumber')
      .isNumeric()
      .isLength({ min: 10, max: 10 })
      .withMessage('Phone number must be exactly 10 digits'),
    body('DateOfJoining').custom((value) => {
      const date = new Date(value);
      if (date > new Date()) throw new Error('Date of Joining cannot be in the future');
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { EmployeeID, Name, Email, PhoneNumber, Department, DateOfJoining, Role } = req.body;

    try {
      const [rows] = await db.query(
        'SELECT * FROM Employees WHERE EmployeeID = ? OR Email = ?',
        [EmployeeID, Email]
      );

      if (rows.length > 0) {
        return res.status(400).json({ message: 'Employee ID or Email already exists' });
      }

      await db.query(
        'INSERT INTO Employees (EmployeeID, Name, Email, PhoneNumber, Department, DateOfJoining, Role) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [EmployeeID, Name, Email, PhoneNumber, Department, DateOfJoining, Role]
      );

      res.status(201).json({ message: 'Employee added successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

app.listen(PORT, () => console.log('Server running on http://localhost:${PORT}'));