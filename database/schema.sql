CREATE DATABASE resume_project;

USE resume_project;

CREATE TABLE resumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150),
  resume_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);