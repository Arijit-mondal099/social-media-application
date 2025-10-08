import { useEffect, useRef, useState } from "react";

interface AutoPlayVideoProps {
  src: string;
  text?: string;
}

export const AutoPlayVideo: React.FC<AutoPlayVideoProps> = ({ src, text }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Toggle mute on user click
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);

      // If unmuting, try to play video
      if (!newMuted) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => console.log("Autoplay prevented"));
        }
      }
    }
  };

  // Observe visibility to autoplay/pause
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsVisible(entry.isIntersecting));
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  // Play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      video.muted = isMuted; // always start muted
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => console.log("Autoplay prevented"));
      }
    } else {
      video.pause();
    }
  }, [isVisible, isMuted]);

  return (
    <div className="w-full max-w-lg relative mx-auto">
      {/* Video */}
      <video
        ref={videoRef}
        loop
        playsInline
        muted
        className="w-full rounded-lg shadow-lg max-h-[80vh] object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Click overlay to mute/unmute */}
      <div
        onClick={toggleMute}
        className="absolute inset-0 w-full h-full cursor-pointer"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      />

      {/* Optional caption/text */}
      {text && (
        <p className="text-left text-sm font-medium mt-2 px-1">{text}</p>
      )}
    </div>
  );
};
