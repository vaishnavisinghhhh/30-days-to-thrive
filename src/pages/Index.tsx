import { useJourney } from "@/context/JourneyContext";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import BucketListInput from "@/components/BucketListInput";

const Index = () => {
  const { days, loading } = useJourney();
  const navigate = useNavigate();
  const bucketListRef = useRef<HTMLDivElement>(null);

  // If user already has a journey, redirect to journey page
  useEffect(() => {
    if (!loading && days.length > 0) {
      navigate("/journey", { replace: true });
    }
  }, [loading, days.length, navigate]);

  const scrollToBucketList = () => {
    bucketListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeroSection onScrollDown={scrollToBucketList} />
      <div ref={bucketListRef}>
        <BucketListInput />
      </div>
    </div>
  );
};

export default Index;
