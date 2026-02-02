export function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Horn */}
      <path
        d="M15 45 Q5 25 8 5 Q12 8 18 12 Q20 20 22 35 L25 45 Z"
        fill="#C9A227"
        stroke="#8B7355"
        strokeWidth="1"
      />
      {/* Right Horn */}
      <path
        d="M85 45 Q95 25 92 5 Q88 8 82 12 Q80 20 78 35 L75 45 Z"
        fill="#C9A227"
        stroke="#8B7355"
        strokeWidth="1"
      />
      {/* Helmet Base */}
      <ellipse
        cx="50"
        cy="60"
        rx="32"
        ry="28"
        fill="#4A4A4A"
        stroke="#2A2A2A"
        strokeWidth="2"
      />
      {/* Helmet Top Dome */}
      <path
        d="M20 55 Q20 30 50 25 Q80 30 80 55"
        fill="#5A5A5A"
        stroke="#2A2A2A"
        strokeWidth="2"
      />
      {/* Helmet Ridge */}
      <path
        d="M50 20 L50 55"
        stroke="#C9A227"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Eye Guard */}
      <path
        d="M25 58 L40 62 L50 58 L60 62 L75 58"
        stroke="#2A2A2A"
        strokeWidth="3"
        fill="none"
      />
      {/* Nose Guard */}
      <path
        d="M50 58 L50 75"
        stroke="#2A2A2A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Eye Holes */}
      <ellipse cx="38" cy="65" rx="8" ry="6" fill="#1A1A1A" />
      <ellipse cx="62" cy="65" rx="8" ry="6" fill="#1A1A1A" />
      {/* Decorative Rivets */}
      <circle cx="25" cy="50" r="2" fill="#C9A227" />
      <circle cx="75" cy="50" r="2" fill="#C9A227" />
      <circle cx="50" cy="85" r="2" fill="#C9A227" />
      {/* Dart behind helmet */}
      <path
        d="M85 90 L50 55"
        stroke="#DC2626"
        strokeWidth="2"
      />
      <path
        d="M85 90 L95 88 L93 98 Z"
        fill="#DC2626"
      />
    </svg>
  );
}
