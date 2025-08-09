"use client";

import { useState, useEffect, useCallback } from "react";

const inputStyle = (darkMode) => ({
  padding: "8px",
  marginBottom: "10px",
  width: "100%",
  borderRadius: "4px",
  border: "1px solid #ccc",
  backgroundColor: darkMode ? "#2e2e2e" : "#fff",
  color: darkMode ? "#fff" : "#000",
});

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "bold",
};

const buttonStyle = {
  padding: "8px 16px",
  borderRadius: "4px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  marginRight: "10px",
};

const [errors, setErrors] = useState({});


export default function JobForm({ onAdd, editingJob, darkMode }) {
  const initialState = {
    company: "",
    position: "",
    dateApplied: "",
    status: "applied",
    reminderDate: "",
    tags: "",
  };

  const [formData, setFormData] = useState(initialState);

  // When editingJob changes, populate form or reset
  useEffect(() => {
    if (editingJob) {
      setFormData({
        company: editingJob.company || "",
        position: editingJob.position || "",
        dateApplied: editingJob.dateApplied || "",
        status: editingJob.status || "applied",
        reminderDate: editingJob.reminderDate || "",
        tags: editingJob.tags ? editingJob.tags.join(", ") : "",
      });
    } else {
      setFormData(initialState);
    }
  }, [editingJob]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form to initial state
  const resetForm = () => setFormData(initialState);

  // Submit handler
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { company, position, dateApplied, status, reminderDate, tags } = formData;
      if (!company || !position || !dateApplied) return;

      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      onAdd({
        company,
        position,
        dateApplied,
        status,
        reminderDate,
        tags: tagsArray,
      });

      if (!editingJob)
        
        // place this validate Function here
        function validate() {
          const newErrors = {};
          if (!company.trim()) newErrors.company = "Company is required.";
          if (!position.trim()) newErrors.position = "Position is required.";
          if (!dateApplied) newErrors.dateApplied = "Date applied is required.";
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
          setErrors(validationErrors);
          if (Object.keys(validationErrors).length > 0) return;

          const tagsArray = tags 
          .split(",")
          .map(())
        }
        
        
        
        
        
        
        
        
        {
        resetForm();
      }
    },
    [formData, onAdd, editingJob]
  );

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <div>
        <label htmlFor="company" style={labelStyle}>
          Company:
        </label>
        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g. Acme Co."
          required
          style={inputStyle(darkMode)}
        />
      </div>
      <div>
        <label htmlFor="position" style={labelStyle}>
          Position:
        </label>
        <input
          id="position"
          name="position"
          type="text"
          value={formData.position}
          onChange={handleChange}
          placeholder="e.g. Frontend Engineer"
          required
          style={inputStyle(darkMode)}
        />
      </div>
      <div>
        <label htmlFor="dateApplied" style={labelStyle}>
          Date Applied:
        </label>
        <input
          id="dateApplied"
          name="dateApplied"
          type="date"
          value={formData.dateApplied}
          onChange={handleChange}
          required
          style={inputStyle(darkMode)}
        />
      </div>
      <div>
        <label htmlFor="status" style={labelStyle}>
          Status:
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={inputStyle(darkMode)}
        >
          <option value="applied">applied</option>
          <option value="interview">interview</option>
          <option value="offer">offer</option>
          <option value="rejected">rejected</option>
        </select>
      </div>
      <div>
        <label htmlFor="reminderDate" style={labelStyle}>
          Reminder Date (optional):
        </label>
        <input
          id="reminderDate"
          name="reminderDate"
          type="date"
          value={formData.reminderDate}
          onChange={handleChange}
          style={inputStyle(darkMode)}
        />
      </div>
      <div>
        <label htmlFor="tags" style={labelStyle}>
          Tags (comma separated):
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g. frontend, remote, urgent"
          style={inputStyle(darkMode)}
        />
      </div>
      <button type="submit" style={buttonStyle}>
        {editingJob ? "Update Job" : "Add Job"}
      </button>
      <button type="button" onClick={resetForm} style={{ ...buttonStyle, backgroundColor: "#6c757d" }}>
        Reset
      </button>
    </form>
  );
}
