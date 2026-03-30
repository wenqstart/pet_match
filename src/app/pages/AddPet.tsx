import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Pet } from "../types";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

export default function AddPet() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "dog" as Pet["type"],
    breed: "",
    gender: "male" as Pet["gender"],
    birthday: "",
    avatar: "",
    personality: [] as string[],
    owner: "",
    bio: "",
    lookingFor: "",
  });
  const [personalityInput, setPersonalityInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.breed || !formData.birthday || !formData.owner) {
      toast.error("请填写必填信息");
      return;
    }

    // Use default avatar if none provided
    const defaultAvatars = {
      dog: "https://images.unsplash.com/photo-1747045170511-9f0f4f3859e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NzY4OTk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      cat: "https://images.unsplash.com/photo-1702914954859-f037fc75b760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NzU4Njk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      other: "https://images.unsplash.com/photo-1747045170511-9f0f4f3859e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NzY4OTk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    };

    const newPet: Pet = {
      id: Date.now().toString(),
      ...formData,
      age: calculateAge(formData.birthday),
      avatar: formData.avatar || defaultAvatars[formData.type],
    };

    const storedPets = localStorage.getItem("pets");
    const pets = storedPets ? JSON.parse(storedPets) : [];
    const updatedPets = [...pets, newPet];
    localStorage.setItem("pets", JSON.stringify(updatedPets));

    toast.success(`${newPet.name} 添加成功！`);
    navigate("/");
  };

  const calculateAge = (birthday: string) => {
    const birth = new Date(birthday);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  };

  const addPersonality = () => {
    if (personalityInput && !formData.personality.includes(personalityInput)) {
      setFormData({
        ...formData,
        personality: [...formData.personality, personalityInput],
      });
      setPersonalityInput("");
    }
  };

  const removePersonality = (trait: string) => {
    setFormData({
      ...formData,
      personality: formData.personality.filter((p) => p !== trait),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl">添加宠物</h2>
          <p className="text-gray-600">填写宠物信息</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>宠物信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-pink-200">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="text-center">
                <Label htmlFor="avatar" className="text-sm text-gray-600">
                  头像链接（可选）
                </Label>
                <Input
                  id="avatar"
                  type="url"
                  placeholder="https://..."
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  留空将使用默认头像
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">
                  宠物名字 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="例如：可乐"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="owner">
                  主人姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="owner"
                  placeholder="例如：张小明"
                  value={formData.owner}
                  onChange={(e) =>
                    setFormData({ ...formData, owner: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <Label className="mb-3 block">宠物类型</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value: Pet["type"]) =>
                  setFormData({ ...formData, type: value })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="dog" id="dog" />
                  <Label htmlFor="dog" className="flex-1 cursor-pointer">
                    <div className="border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:border-pink-300 transition-colors">
                      <span className="text-2xl">🐶</span>
                      <span>狗狗</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="cat" id="cat" />
                  <Label htmlFor="cat" className="flex-1 cursor-pointer">
                    <div className="border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:border-pink-300 transition-colors">
                      <span className="text-2xl">🐱</span>
                      <span>猫咪</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="flex-1 cursor-pointer">
                    <div className="border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:border-pink-300 transition-colors">
                      <span className="text-2xl">🐾</span>
                      <span>其他</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Breed and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="breed">
                  品种 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="breed"
                  placeholder="例如：金毛"
                  value={formData.breed}
                  onChange={(e) =>
                    setFormData({ ...formData, breed: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label className="mb-3 block">性别</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value: Pet["gender"]) =>
                    setFormData({ ...formData, gender: value })
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">🦁 男生</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">🌸 女生</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Birthday */}
            <div>
              <Label htmlFor="birthday">
                生日 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
                required
              />
            </div>

            {/* Personality */}
            <div>
              <Label htmlFor="personality">性格标签</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="personality"
                  placeholder="例如：活泼、友善"
                  value={personalityInput}
                  onChange={(e) => setPersonalityInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPersonality();
                    }
                  }}
                />
                <Button type="button" onClick={addPersonality} variant="outline">
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.personality.map((trait, index) => (
                  <div
                    key={index}
                    className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{trait}</span>
                    <button
                      type="button"
                      onClick={() => removePersonality(trait)}
                      className="hover:text-pink-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">自我介绍</Label>
              <Textarea
                id="bio"
                placeholder="介绍一下你的宠物..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Looking For */}
            <div>
              <Label htmlFor="lookingFor">期望对象</Label>
              <Textarea
                id="lookingFor"
                placeholder="描述一下理想的伴侣..."
                value={formData.lookingFor}
                onChange={(e) =>
                  setFormData({ ...formData, lookingFor: e.target.value })
                }
                rows={2}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
              >
                取消
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                保存
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
