import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- DATABASE CONNECTION ---------------- */

const db = mysql.createConnection({
  host: "localhost",
  user: "appuser",
  password: "1234",
  database: "resume_project"
});

db.connect(err => {
  if (err) {
    console.log("Database error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

/* ---------------- ROOT API ---------------- */

app.get("/", (req, res) => {
  res.send("Server running");
});

/* ---------------- SIGNUP API ---------------- */

app.post("/signup", async (req, res) => {

  const { name, email, password } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name,email,password) VALUES (?,?,?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "User registered successfully"
      });

    });

  } catch (error) {
    res.status(500).json({
      message: "Signup failed"
    });
  }

});

/* ---------------- LOGIN API ---------------- */

app.post("/login", (req, res) => {

  console.log(req.body);

  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    const user = result[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  });

});

/* ---------------- RESUME ANALYSIS API ---------------- */

app.post("/analyze", (req, res) => {

  const { jobDescription, resumes } = req.body;

  if (!jobDescription || !resumes) {
    return res.status(400).json({
      error: "Job description and resumes required"
    });
  }

  const candidates = resumes.map((resume, index) => {

    const score = Math.floor(Math.random() * 100);

    return {
      name: "Candidate " + (index + 1),
      email: "",
      fileName: resume.fileName,
      jobFitScore: score,
      semanticScore: score,
      skillMatchScore: score,
      matchedSkills: [],
      missingSkills: [],
      relevantExperience: [],
      relevantProjects: [],
      summary: "Resume analyzed successfully"
    };

  });

  res.json({
    requiredSkills: [],
    candidates
  });

});

/* ---------------- SERVER START ---------------- */

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});