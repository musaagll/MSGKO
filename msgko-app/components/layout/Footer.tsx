import Link from "next/link";

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
                { Icon: InstagramIcon, href: "https://www.instagram.com/msgclip/", label: "Instagram" },
                { Icon: YoutubeIcon,   href: "https://www.youtube.com/@musaagll",  label: "YouTube" },
                { Icon: XIcon,         href: "https://x.com/musaagll",             label: "X (Twitter)" },
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
