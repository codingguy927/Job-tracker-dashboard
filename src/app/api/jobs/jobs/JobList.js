export default function JobList({ jobs }) {
  if (!jobs || jobs.length === 0) {
    return <p>No jobs found.</p>;
  }

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Company</th>
          <th>Position</th>
          <th>Date Applied</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id}>
            <td>{job.company}</td>
            <td>{job.position}</td>
            <td>
              {new Date(job.dateApplied).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </td>
            <td>{job.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
