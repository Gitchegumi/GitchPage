"use client";

import { useRef, useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Download } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  title: string;
  showDownloadButton?: boolean;
}

export function AudioPlayer({ src, title, showDownloadButton }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch((e) => console.error("Error playing audio:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => { setIsPlaying(false); setCurrentTime(0); };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    if (audio.readyState >= 1) handleLoadedMetadata();

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSliderChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  return (
    <div
      className="rounded-2xl p-5 space-y-4 backdrop-blur-xl"
      style={{
        background: "rgba(44,44,44,0.45)",
        border: "1px solid rgba(175,224,206,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <p className="text-center font-semibold font-oswald text-lg" style={{ color: "#fca311" }}>
        {title}
      </p>

      <audio ref={audioRef} src={src} />

      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 h-9 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#fca311", color: "#2c2c2c" }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <span className="text-sm" style={{ color: "#CCDBDC" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {showDownloadButton && (
          <a
            href={src}
            download
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-opacity hover:opacity-75"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(204,219,220,0.25)",
              color: "#f0f0f0",
            }}
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>

      <Slider
        value={[currentTime]}
        max={duration || 0}
        step={1}
        onValueChange={handleSliderChange}
        className="w-full"
      />
    </div>
  );
}
