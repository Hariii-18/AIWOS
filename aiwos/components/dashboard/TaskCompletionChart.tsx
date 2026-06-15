export function TaskCompletionChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          Task Completion (This Week)
        </span>
        <span className="text-xs text-muted-foreground">7-day trend</span>
      </div>

      <div style={{ height: 160, padding: "0 4px" }}>
        <svg
          width="100%"
          height="160"
          viewBox="0 0 560 160"
          preserveAspectRatio="none"
          overflow="visible"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[32, 64, 96, 128].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="560"
              y2={y}
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path
            d="M0,120 C70,100 100,80 160,70 C220,60 240,50 280,45 C320,40 360,30 400,35 C440,40 480,25 560,20 L560,155 L0,155 Z"
            fill="url(#lineGrad)"
          />

          {/* Line */}
          <path
            d="M0,120 C70,100 100,80 160,70 C220,60 240,50 280,45 C320,40 360,30 400,35 C440,40 480,25 560,20"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data points */}
          {[
            [0, 120],
            [80, 90],
            [160, 70],
            [240, 50],
            [320, 40],
            [400, 35],
            [480, 25],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="#7c3aed" />
          ))}
          <circle cx="560" cy="20" r="5" fill="#7c3aed" stroke="var(--card)" strokeWidth="2" />

          {/* Day labels */}
          {days.map((day, i) => (
            <text
              key={day}
              x={i * 80}
              y="156"
              fill="var(--faint)"
              fontSize="11"
              fontFamily="inherit"
            >
              {day}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
