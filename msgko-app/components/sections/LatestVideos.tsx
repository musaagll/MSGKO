"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useState } from "react";
import type { YTVideo } from "@/lib/youtube";
import { timeAgo } from "@/lib/utils";

const THUMB_BG = [
  "linear-gradient(135deg, #1a0808 0%, #2a0a0a 40%, #0a0505 100%)",
  "linear-gradient(135deg, #0a1020 0%, #14263a 40%, #0a0c14 100%)",
  "linear-gradient(135deg, #141008 0%, #201808 40%, #0c0a05 100%)",
  "linear-gradient(135deg, #0a0c18 0%, #101428 40%, #080a10 100%)",
];

function VideoCard({ video, index }: { video: YTVideo; index: number }) {
  const [hovered, setHovered] = useState(false);
  const bg = THUMB_BG[index % THUMB_BG.length];

  return (
    <a
      href={video.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2.5 rounded-xl overflow-hidden"
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={video.title}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "16/9" }}>
        {video.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-400"
            style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-400"
            style={{ background: bg, transform: hovered ? "scale(1.04)" : "scale(1)" }}
          />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75) 100%)" }}
        />

        {/* Play button on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div
            className="flex items-center justify-center w-11 h-11 rounded-full"
            style={{ background: "rgba(0,0,0,0.6)", border: "1.5px solid rgba(255,255,255,0.3)", backdropFilter: "blur(4px)" }}
          >
            <Play size={16} className="fill-white ml-0.5" style={{ color: "white" }} />
          </div>
        </div>

        {/* Duration */}
        {video.durationFormatted && (
          <div
            className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-bold"
            style={{ background: "rgba(0,0,0,0.8)", color: "#f0ead6", fontSize: "11px" }}
          >
            {video.durationFormatted}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="px-0.5">
        <h3
          className="font-semibold leading-snug mb-1 transition-colors duration-200"
          style={{
            fontSize: "13.5px",
            color: hovered ? "#f0ead6" : "#d4c89a",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {video.title}
        </h3>
        <span style={{ fontSize: "11.5px", color: "#5a5448" }}>{timeAgo(video.publishedAt)}</span>
      </div>
    </a>
  );
}

export function LatestVideos({ videos }: { videos: YTVideo[] }) {
  const featured = videos.slice(0, 4);

  return (
    <section
      className="relative z-10"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      aria-label="Son videolar"
    >
      <div className="section-container py-12 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="font-bold" style={{ fontSize: "20px", color: "#f0ead6", letterSpacing: "-0.01em" }}>
              Son Videolar
            </h2>
            <span className="gold-line" aria-hidden="true" />
          </div>
          <Link
            href="/youtube"
            className="group flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
            style={{ color: "#c9a84c", textDecoration: "none" }}
          >
            Tüm Videolar
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div
          className="sm:hidden flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {featured.map((video, i) => (
            <div
              key={video.id}
              className="flex-none snap-start"
              style={{ width: i === 0 ? "78vw" : "72vw", maxWidth: "300px" }}
            >
              <VideoCard video={video} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
