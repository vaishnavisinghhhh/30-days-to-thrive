import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import BucketListInput from "@/components/BucketListInput";

const Index = () => {
  const bucketListRef = useRef<HTMLDivElement>(null);

  const scrollToBucketList = () => {
    bucketListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
