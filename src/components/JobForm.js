"use client";

import { useState, useEffect } from "react";

export default function JobForm({ onAdd, editingJob, darkMode }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [status, setStatus] = useState("applied");
  const [reminderDate, setReminderDate] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingJob) {
      setCompany(editingJob.company || "");
      setPosition(editingJob.position || "");
      setDateApplied(editingJob.dateApplied || "");
      setStatus(editingJob.status || "applied");
      setReminderDate(editingJob.reminderDate || "");
      setTags(editingJob.tags ? editingJob.tags.join(", ") : "");
    } else {
      setCompany("");
      setPosition("");
      setDateApplied("");
      setStatus("applied");
      setReminderDate("");
      setTags("");
    }
  }, [editingJob]);

  function validate() {
    const newErrors = {};
    if (!company.trim()) newErrors.company = "Company is required.";
    if (!position.trim()) newErrors.position = "Position is required.";
    if (!dateApplied.trim()) newErrors.dateApplied = "Date applied is required.";
    if (reminderDate && dateApplied) {
      if (new Date(reminderDate) < new Date(dateApplied)) {
        newErrors.reminderDate = "Reminder date cannot be before the date applied.";
      }
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newJob = {
      company,
      position,
      dateApplied,
      status,
      reminderDate,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    onAdd(newJob);
    setErrors({});

    if (!editingJob) {
      setCompany("");
      setPosition("");
      setDateApplied("");
      setStatus("applied");
      setReminderDate("");
      setTags("");
    }
  }

  const inputStyle = {
    padding: "8px",
    marginBottom: "10px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: darkMode ? "#2e2e2e" : "#fff",
    color: darkMode ? "#fff" : "#000",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <div>
        <label style={labelStyle}>Company:</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g. Acme Co."
          style={inputStyle}
        />
        {errors.company && <p style={{ color: "red" }}>{errors.company}</p>}
      </div>
      <div>
        <label style={labelStyle}>Position:</label>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="e.g. Frontend Engineer"
          style={inputStyle}
        />
        {errors.position && <p style={{ color: "red" }}>{errors.position}</p>}
      </div>
      <div>
        <label style={labelStyle}>Date Applied:</label>
        <input
          type="date"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
          style={inputStyle}
        />
        {errors.dateApplied && <p style={{ color: "red" }}>{errors.dateApplied}</p>}
      </div>
      <div>
        <label style={labelStyle}>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          <option value="applied">applied</option>
          <option value="interview">interview</option>
          <option value="offer">offer</option>
          <option value="rejected">rejected</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Reminder Date (optional):</label>
        <input
          type="date"
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          style={inputStyle}
        />
        {errors.reminderDate && <p style={{ color: "red" }}>{errors.reminderDate}</p>}
      </div>
      <div>
        <label style={labelStyle}>Tags (comma separated):</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. frontend, remote, urgent"
          style={inputStyle}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "8px 16px",
          borderRadius: "4px",
          backgroundColor: darkMode ? "#007bff" : "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {editingJob ? "Update Job" : "Add Job"}
      </button>
    </form>
  );
}
