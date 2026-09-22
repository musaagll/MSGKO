import Link from "next/link";

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <path d="m10 15 5-3-5-3z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.845L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      className="relative z-10"
      style={{
        borderTop: "1px solid rgba(201,168,76,0.1)",
        background: "rgba(7,8,13,0.95)",
      }}
      aria-label="Footer"
    >
      <div className="section-container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left — Brand */}
          <div className="flex flex-col items-center md:items-start">
            <span
              className="font-black leading-none"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "20px",
                background: "linear-gradient(135deg, #e8c96a 0%, #c9a84c 50%, #a07830 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.06em",
              }}
            >
              MSGKO
            </span>
            <span
              className="uppercase tracking-[0.18em] mt-0.5"
              style={{ fontSize: "7px", color: "#3a3530", letterSpacing: "0.2em" }}
            >
              Knight Online Community
            </span>
          </div>

          {/* Center — Tagline + copyright */}
          <div className="flex flex-col items-center text-center">
            <p style={{ fontSize: "12px", color: "#5a5448", marginBottom: "4px" }}>
              Aynı Oyun, Daha Güçlü Bir Topluluk.
            </p>
            <p style={{ fontSize: "11px", color: "#3a3530" }}>
              © 2026 MSGKO. Tüm hakları saklıdır.
            </p>
          </div>

          {/* Right — Social + decoration */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-2">
              {[
                { Icon: DiscordIcon,   href: "#",                                          label: "Discord" },
                { Icon: InstagramIcon, href: "https://www.instagram.com/msgclip/",         label: "Instagram" },
                { Icon: YoutubeIcon,   href: "https://www.youtube.com/@musaagll",          label: "YouTube" },
                { Icon: XIcon,         href: "https://x.com/musaagll",                    label: "X (Twitter)" },
              ].map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#5a5448",
                  }}
                  aria-label={label}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#c9a84c";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#5a5448";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  <Icon />
                </Link>
              ))}
            </div>

            {/* Decorative words */}
            <div className="flex gap-3" aria-hidden="true">
              {["PLAY", "SHARE", "BELONG"].map((w) => (
                <span
                  key={w}
                  className="font-black tracking-widest"
                  style={{ fontSize: "8px", color: "rgba(255,255,255,0.06)", letterSpacing: "0.18em" }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
