import { useRef } from "react";
import { useJourney } from "@/context/JourneyContext";

interface PhotoGalleryProps {
  dayIndex: number;
}

const PhotoGallery = ({ dayIndex }: PhotoGalleryProps) => {
  const { days, setDays } = useJourney();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photos = days[dayIndex]?.photos || [];

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setDays((prev) => {
          const updated = [...prev];
          updated[dayIndex] = {
            ...updated[dayIndex],
            photos: [...updated[dayIndex].photos, result],
          };
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoIndex: number) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        photos: updated[dayIndex].photos.filter((_, i) => i !== photoIndex),
      };
      return updated;
    });
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-secondary mb-3">
            Capture the Moment
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-2">
            Memory Gallery
          </h2>
          <p className="font-body text-sm text-muted-foreground italic">
            Curated like the pages of Vogue — your life, your editorial.
          </p>
        </div>

        {/* Gallery grid - magazine style */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`relative group overflow-hidden rounded-lg journal-shadow ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={photo}
                alt={`Memory ${i + 1}`}
                className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-700"
              />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/50 text-background text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}

          {/* Add photo button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 bg-card/50"
          >
            <span className="text-3xl text-muted-foreground/50">+</span>
            <span className="font-sans-light text-xs text-muted-foreground tracking-wide">
              Add Memory
            </span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleAddPhoto}
          className="hidden"
        />
      </div>
    </section>
  );
};

export default PhotoGallery;
