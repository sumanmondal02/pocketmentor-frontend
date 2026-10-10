const map = {
  READY: ['Ready', 'bg-mint'], PROCESSING: ['Processing...', 'bg-lavender'],
  FAILED: ['Failed', 'bg-peach'], NOT_GENERATED: ['Not generated', 'bg-sky'],
}
export default function StatusBadge({ status }) {
  const [label, tone] = map[status] || map.NOT_GENERATED
  return <span className={`chip ${tone} whitespace-nowrap`}>{label}</span>
}