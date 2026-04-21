import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  getDonghuaStats,
  getDonghuaArcs,
  updateDonghuaProgress,
  updateArcStatus,
  type DonghuaArc,
} from "@/services/donghua";
import { Loader2, Tv, BookOpen, RefreshCw } from "lucide-react";

export default function DonghuaAdmin() {
  const [stats, setStats] = useState<{
    currentEpisode: number;
    totalEpisodes: number;
    currentChapter: number;
    totalChapters: number;
  } | null>(null);
  const [arcs, setArcs] = useState<DonghuaArc[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    currentEpisode: 128,
    totalEpisodes: 350,
    currentChapter: 850,
    totalChapters: 2100,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, arcsData] = await Promise.all([
        getDonghuaStats(),
        getDonghuaArcs(),
      ]);
      
      if (statsData) {
        setStats(statsData);
        setFormData({
          currentEpisode: statsData.currentEpisode,
          totalEpisodes: statsData.totalEpisodes,
          currentChapter: statsData.currentChapter,
          totalChapters: statsData.totalChapters,
        });
      }
      setArcs(arcsData);
    } catch (error) {
      toast.error("Failed to fetch donghua data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      // Map camelCase form data to snake_case for the API
      const progressData = {
        current_episode: formData.currentEpisode,
        total_episodes: formData.totalEpisodes,
        current_chapter: formData.currentChapter,
        total_chapters: formData.totalChapters,
      };
      await updateDonghuaProgress(progressData);
      toast.success("Progress updated successfully");
      fetchData();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update progress");
    } finally {
      setUpdating(false);
    }
  };

  const handleArcStatusChange = async (arcId: string, newStatus: DonghuaArc["status"]) => {
    try {
      await updateArcStatus(arcId, newStatus);
      toast.success("Arc status updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update arc status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Update Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <RefreshCw className="w-5 h-5" />
              Update Donghua Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProgress} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currentEpisode">Current Episode</Label>
                <Input
                  id="currentEpisode"
                  type="number"
                  value={formData.currentEpisode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    currentEpisode: parseInt(e.target.value) || 0
                  }))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalEpisodes">Total Episodes (Estimated)</Label>
                <Input
                  id="totalEpisodes"
                  type="number"
                  value={formData.totalEpisodes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    totalEpisodes: parseInt(e.target.value) || 0
                  }))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentChapter">Current Chapter Adapted</Label>
                <Input
                  id="currentChapter"
                  type="number"
                  value={formData.currentChapter}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    currentChapter: parseInt(e.target.value) || 0
                  }))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalChapters">Total Chapters</Label>
                <Input
                  id="totalChapters"
                  type="number"
                  value={formData.totalChapters}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    totalChapters: parseInt(e.target.value) || 0
                  }))}
                  min={0}
                />
              </div>
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={updating}
                >
                  {updating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Update Progress
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Tv className="w-4 h-4" />
                <span className="text-xs font-heading tracking-wider uppercase">Episodes</span>
              </div>
              <p className="text-2xl font-heading">
                {stats.currentEpisode} / {stats.totalEpisodes}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.currentEpisode / stats.totalEpisodes) * 100)}% complete
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-heading tracking-wider uppercase">Chapters</span>
              </div>
              <p className="text-2xl font-heading">
                {stats.currentChapter} / {stats.totalChapters}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.currentChapter / stats.totalChapters) * 100)}% adapted
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Arc Status Management */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="font-heading">Story Arc Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {arcs.map((arc, i) => (
              <div
                key={arc.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-heading">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-heading text-sm">{arc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Ep {arc.episode_start}-{arc.episode_end} • Ch {arc.chapter_start}-{arc.chapter_end}
                    </p>
                  </div>
                </div>
                <select
                  value={arc.status}
                  onChange={(e) => handleArcStatusChange(arc.id, e.target.value as DonghuaArc["status"])}
                  className="text-xs px-2 py-1 rounded border border-border bg-background font-heading"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="now_airing">Now Airing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
