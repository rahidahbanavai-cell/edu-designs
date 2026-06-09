export function LeafIcon({ size = 20 }: { size?: number }) {
  const h = Math.round(size * 1.3)
  return (
    <svg width={size} height={h} viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2C6.5 5 2 10.5 2 16.5C2 21.8 5.6 24.5 10 24.5C14.4 24.5 18 21.8 18 16.5C18 10.5 13.5 5 10 2Z" fill="#00ED64"/>
      <path d="M10 24.5V13" stroke="#051209" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
