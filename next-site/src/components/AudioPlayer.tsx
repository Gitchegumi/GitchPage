"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

import { Download } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  title: string;
  showDownloadButton?: boolean;
}

export function AudioPlayer({
  src,
  title,
  showDownloadButton,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Effect to handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((e) => console.error("Error playing audio:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Effect to set up event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Set initial duration if metadata is already loaded
    if (audio.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

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
    <Card className="bg-gradient-to-b from-brand-dark to-brand-blue text-soft-white">
      <CardHeader>
        <CardTitle className="text-center text-brand-orange">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <audio ref={audioRef} src={src} />
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Button onClick={togglePlayPause} variant="outline">
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <div>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          {showDownloadButton && (
            <Button asChild variant="outline">
              <a href={src} download>
                <Download className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
        <Slider
          value={[currentTime]}
          max={duration || 0}
          step={1}
          onValueChange={handleSliderChange}
          className="mt-4 w-full"
        />
      </CardContent>
    </Card>
  );
}
