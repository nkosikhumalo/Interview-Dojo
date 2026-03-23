// Textarea component for capturing the job description / target role.
// The Dojo uses this text to tailor questions and to help the backend
// extract relevant keywords for feedback scoring.

export default function JobDescriptionInput({
  value,
  onChange,
  placeholder = 'Paste the job description here...',
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>
        Job Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        style={{
          width: '100%',
          borderRadius: 10,
          padding: 12,
          border: '1px solid #ddd',
        }}
        placeholder={placeholder}
      />
    </div>
  )
}

