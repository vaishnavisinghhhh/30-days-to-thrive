import { useParams, useNavigate } from "react-router-dom";
import { useJourney } from "@/context/JourneyContext";
import { useRef, useState } from "react";
import { ArrowLeft, Camera, X, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "sonner";

const DayJournalPage = () => {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { days, saveDayJournal, saveDayCompletion, uploadPhoto, deletePhoto } = useJourney();
  const dayNum = parseInt(dayNumber || "1", 10);
  const dayIndex = dayNum - 1;
  const fileRef = useRef<HTMLInputElement>(null);
  const [localEntry, setLocalEntry] = useState(days[dayIndex]?.journalEntry || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!days.length || dayIndex < 0 || dayIndex >= days.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <button onClick={() => navigate("/")} className="text-primary font-sans-light tracking-widest uppercase text-sm">
          ← Go Home
        </button>
      </div>
    );
  }

  const day = days[dayIndex];
  const wordCount = localEntry.split(/\s+/).filter(Boolean).length;

  const handleSaveAndComplete = async () => {
    setSaving(true);
    await saveDayJournal(dayIndex, localEntry);
    if (!day.completed) {
      await saveDayCompletion(dayIndex, true);
    }
    toast.success("Day completed! 🎉");
    setSaving(false);
    navigate(`/day/${dayNum}`);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    await saveDayJournal(dayIndex, localEntry);
    toast.success("Journal saved!");
    setSaving(false);
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      await uploadPhoto(dayIndex, file);
    }
    setUploading(false);
    toast.success("Photos added!");
  };

  const handleRemovePhoto = async (photoUrl: string) => {
    await deletePhoto(dayIndex, photoUrl);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-lg font-medium text-foreground">Day {dayNum} — Journal</h1>
          <p className="font-body text-xs text-muted-foreground italic line-clamp-1">{day.goal}</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          disabled={uploading}
        >
          <Camera className={`w-5 h-5 text-primary ${uploading ? "animate-pulse" : ""}`} />
        </button>
      </div>

      <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleAddPhoto} />

      <div className="px-6 max-w-lg mx-auto pt-6">
        {/* Photos grid */}
        {day.photos.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-2 mb-6">
            {day.photos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemovePhoto(photo)}
                  className="absolute top-1 right-1 w-6 h-6 bg-destructive/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-destructive-foreground" />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Journal */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-sans-light text-xs tracking-widest uppercase text-muted-foreground">
              Your Reflections
            </p>
            <span className="font-sans-light text-xs text-muted-foreground">{wordCount} words</span>
          </div>
          <Textarea
            value={localEntry}
            onChange={(e) => setLocalEntry(e.target.value)}
            placeholder="Write about your day... What did you feel? What surprised you? What will you remember?"
            className="min-h-[300px] bg-muted/30 border-border font-body text-sm resize-none focus:ring-primary/30 rounded-xl"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex-1 font-sans-light text-sm tracking-widest uppercase py-3 border border-border rounded-xl hover:bg-muted/50 transition-colors text-foreground"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handleSaveAndComplete}
            disabled={saving}
            className="flex-1 font-sans-light text-sm tracking-widest uppercase py-3 bg-primary text-primary-foreground rounded-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {day.completed ? "Update & Done" : "Complete Day"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayJournalPage;
