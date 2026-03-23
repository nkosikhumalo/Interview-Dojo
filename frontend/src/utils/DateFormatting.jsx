// Helper functions for date/time formatting.
// Keep UI formatting utilities separate from components.

export function formatDateTime(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString()
}
