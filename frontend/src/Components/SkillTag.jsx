// Small UI component for rendering tags (e.g., categories or skills).

export default function SkillTag({ label }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid #e5e7eb',
        background: '#f9fafb',
        fontSize: 12,
      }}
    >
      {label}
    </span>
  )
}

