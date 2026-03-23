// Generic reusable UI input components (buttons, text fields, etc.).
// These are presentational-only and should not perform business logic.

export function TextInput({ value, onChange, placeholder = '' }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        borderRadius: 10,
        padding: 12,
        border: '1px solid #ddd',
      }}
    />
  )
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid #0ea5e9',
        background: '#0ea5e9',
        color: 'white',
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}
