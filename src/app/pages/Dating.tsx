import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Pet } from "../types";
import { mockDatingPets } from "../data/mockData";
import { Heart, X, MapPin, Info } from "lucide-react";
import { toast } from "sonner";

export default function Dating() {
  const [datingPets, setDatingPets] = useState<Pet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDatingPets(mockDatingPets);
  }, []);

  const currentPet = datingPets[currentIndex];

  const handleLike = () => {
    if (currentPet) {
      toast.success(`喜欢了 ${currentPet.name}！`, {
        description: "我们会通知对方主人",
      });
      nextPet();
    }
  };

  const handlePass = () => {
    nextPet();
  };

  const nextPet = () => {
    if (currentIndex < datingPets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.info("已经看完所有宠物啦！", {
        description: "稍后会有更多宠物",
      });
    }
  };

  const calculateAge = (birthday: string) => {
    const birth = new Date(birthday);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    return `${years}岁`;
  };

  if (!currentPet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Heart className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">暂时没有更多宠物了</p>
        <p className="text-sm text-gray-400">稍后再来看看吧～</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl mb-2">宠物相亲</h2>
        <p className="text-gray-600">为你的宠物找到合适的伴侣</p>
      </div>

      {/* Dating Card */}
      <Card className="overflow-hidden border-2 border-pink-200 shadow-xl">
        <div className="relative">
          <img
            src={currentPet.avatar}
            alt={currentPet.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-sm">{currentIndex + 1}</span>
            <span className="text-xs text-gray-500">/ {datingPets.length}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-3xl">{currentPet.name}</h3>
              <span className="text-2xl">
                {currentPet.gender === "male" ? "🦁" : "🌸"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <span>{currentPet.breed}</span>
              <span>·</span>
              <span>{calculateAge(currentPet.birthday)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <MapPin className="w-4 h-4" />
              <span>主人: {currentPet.owner}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Personality Tags */}
          <div>
            <h4 className="text-sm text-gray-500 mb-2">性格标签</h4>
            <div className="flex flex-wrap gap-2">
              {currentPet.personality.map((trait, index) => (
                <Badge
                  key={index}
                  className="bg-pink-100 text-pink-700 border-pink-200"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-sm text-gray-500 mb-2">自我介绍</h4>
            <p className="text-gray-700">{currentPet.bio}</p>
          </div>

          {/* Looking For */}
          <div className="bg-pink-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <h4 className="text-sm">期望对象</h4>
            </div>
            <p className="text-sm text-gray-700">{currentPet.lookingFor}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6">
        <Button
          onClick={handlePass}
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        >
          <X className="w-8 h-8 text-gray-500" />
        </Button>

        <Button
          onClick={handleLike}
          size="lg"
          className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg"
        >
          <Heart className="w-10 h-10" fill="white" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50"
        >
          <Info className="w-8 h-8 text-blue-500" />
        </Button>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-4">
          <p className="text-sm text-gray-600 text-center">
            💡 点击 ❤️ 表示喜欢，点击 ✖️ 查看下一个
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
