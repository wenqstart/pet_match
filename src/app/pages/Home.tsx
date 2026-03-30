import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Pet } from "../types";
import { mockPets } from "../data/mockData";
import { PawPrint, Calendar, Cake, Heart } from "lucide-react";

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    // Load pets from localStorage or use mock data
    const stored = localStorage.getItem("pets");
    if (stored) {
      setPets(JSON.parse(stored));
    } else {
      setPets(mockPets);
      localStorage.setItem("pets", JSON.stringify(mockPets));
    }
  }, []);

  const calculateAge = (birthday: string) => {
    const birth = new Date(birthday);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years === 0) {
      return `${months}个月`;
    } else if (months < 0) {
      return `${years - 1}岁${12 + months}个月`;
    } else {
      return `${years}岁${months}个月`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl p-6 text-white">
        <h2 className="text-3xl mb-2">欢迎来到宠物缘！</h2>
        <p className="text-pink-50">
          管理你的宠物，记录美好时光，寻找合适的伴侣
        </p>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-2xl">🐾</div>
            <div className="text-sm mt-1">{pets.length} 只宠物</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-2xl">💝</div>
            <div className="text-sm mt-1">待匹配</div>
          </div>
        </div>
      </div>

      {/* My Pets Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-pink-500" />
            我的宠物
          </h3>
          <Link to="/add-pet">
            <Button variant="outline" size="sm">
              添加宠物
            </Button>
          </Link>
        </div>

        {pets.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <PawPrint className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">还没有添加宠物</p>
              <Link to="/add-pet">
                <Button>添加第一只宠物</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pets.map((pet) => (
              <Link key={pet.id} to={`/pet/${pet.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-pink-300">
                  <div className="flex gap-4 p-4">
                    <div className="relative">
                      <img
                        src={pet.avatar}
                        alt={pet.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                        {pet.gender === "male" ? "🦁" : "🌸"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg mb-1">{pet.name}</h4>
                          <p className="text-sm text-gray-500">
                            {pet.breed} · {calculateAge(pet.birthday)}
                          </p>
                        </div>
                        <Heart className="w-5 h-5 text-pink-400" />
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {pet.personality.slice(0, 3).map((trait, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-pink-100 text-pink-700 text-xs"
                          >
                            {trait}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>生日 {pet.birthday}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/dating">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-sm">宠物相亲</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/expenses">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-sm">记账</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/memories">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                <Cake className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm">纪念日</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/add-pet">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm">添加宠物</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
