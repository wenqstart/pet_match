import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Pet, Anniversary } from "../types";
import { mockAnniversaries } from "../data/mockData";
import { Plus, Calendar, Cake, Heart, Star } from "lucide-react";
import { toast } from "sonner";

const typeIcons: Record<string, any> = {
  birthday: Cake,
  adoption: Heart,
  custom: Star,
};

const typeLabels: Record<string, string> = {
  birthday: "生日",
  adoption: "领养日",
  custom: "自定义",
};

export default function Memories() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    petId: "",
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "custom" as Anniversary["type"],
    notes: "",
  });

  useEffect(() => {
    const storedPets = localStorage.getItem("pets");
    if (storedPets) {
      setPets(JSON.parse(storedPets));
    }

    const storedAnniversaries = localStorage.getItem("anniversaries");
    if (storedAnniversaries) {
      setAnniversaries(JSON.parse(storedAnniversaries));
    } else {
      setAnniversaries(mockAnniversaries);
      localStorage.setItem("anniversaries", JSON.stringify(mockAnniversaries));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.petId || !formData.title || !formData.date) {
      toast.error("请填写完整信息");
      return;
    }

    const newAnniversary: Anniversary = {
      id: Date.now().toString(),
      petId: formData.petId,
      title: formData.title,
      date: formData.date,
      type: formData.type,
      notes: formData.notes,
    };

    const updatedAnniversaries = [...anniversaries, newAnniversary];
    setAnniversaries(updatedAnniversaries);
    localStorage.setItem("anniversaries", JSON.stringify(updatedAnniversaries));

    toast.success("纪念日添加成功！");
    setIsDialogOpen(false);
    setFormData({
      petId: "",
      title: "",
      date: new Date().toISOString().split("T")[0],
      type: "custom",
      notes: "",
    });
  };

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p.id === petId);
    return pet?.name || "未知宠物";
  };

  const calculateDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "明天";
    if (diffDays < 0) return `${Math.abs(diffDays)}天前`;
    return `还有${diffDays}天`;
  };

  const upcomingAnniversaries = anniversaries
    .filter((ann) => {
      const targetDate = new Date(ann.date);
      const today = new Date();
      const diffDays = Math.ceil(
        (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 0 && diffDays <= 30;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">宠物纪念日</h2>
          <p className="text-gray-600">记录重要的日子</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              添加纪念日
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加纪念日</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="petId">选择宠物</Label>
                <Select
                  value={formData.petId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, petId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择宠物" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">类型</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Anniversary["type"]) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  placeholder="例如：可乐的生日"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="date">日期</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes">备注</Label>
                <Textarea
                  id="notes"
                  placeholder="添加一些备注..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <Button type="submit" className="w-full">
                保存
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Anniversaries */}
      {upcomingAnniversaries.length > 0 && (
        <Card className="bg-gradient-to-r from-pink-400 to-purple-400 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              即将到来的纪念日
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAnniversaries.slice(0, 3).map((ann) => {
                const Icon = typeIcons[ann.type];
                return (
                  <div
                    key={ann.id}
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{ann.title}</h4>
                        <p className="text-sm text-pink-50">
                          {getPetName(ann.petId)} · {ann.date}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-white/30 border-white/50">
                      {calculateDaysUntil(ann.date)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Anniversaries by Type */}
      <div className="space-y-6">
        {Object.entries(typeLabels).map(([type, label]) => {
          const typedAnniversaries = anniversaries.filter(
            (ann) => ann.type === type
          );

          if (typedAnniversaries.length === 0) return null;

          const Icon = typeIcons[type];

          return (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-pink-500" />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {typedAnniversaries
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((ann) => (
                      <div
                        key={ann.id}
                        className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{ann.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {calculateDaysUntil(ann.date)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Badge className="bg-pink-100 text-pink-700">
                            {getPetName(ann.petId)}
                          </Badge>
                          <span>{ann.date}</span>
                        </div>
                        {ann.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            {ann.notes}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {anniversaries.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">还没有添加纪念日</p>
            <Button onClick={() => setIsDialogOpen(true)}>添加第一个纪念日</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
