import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Pet, Expense, Anniversary } from "../types";
import { ArrowLeft, Edit, Calendar, Wallet, Heart, Cake } from "lucide-react";

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);

  useEffect(() => {
    const storedPets = localStorage.getItem("pets");
    if (storedPets) {
      const pets: Pet[] = JSON.parse(storedPets);
      const foundPet = pets.find((p) => p.id === id);
      setPet(foundPet || null);
    }

    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      const allExpenses: Expense[] = JSON.parse(storedExpenses);
      setExpenses(allExpenses.filter((e) => e.petId === id));
    }

    const storedAnniversaries = localStorage.getItem("anniversaries");
    if (storedAnniversaries) {
      const allAnniversaries: Anniversary[] = JSON.parse(storedAnniversaries);
      setAnniversaries(allAnniversaries.filter((a) => a.petId === id));
    }
  }, [id]);

  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 mb-4">找不到这只宠物</p>
        <Button onClick={() => navigate("/")}>返回首页</Button>
      </div>
    );
  }

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

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryIcons: Record<string, string> = {
    food: "🍖",
    medical: "💊",
    toys: "🎾",
    grooming: "✂️",
    other: "📦",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
        <h2 className="text-2xl flex-1">{pet.name}的资料</h2>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          编辑
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden border-2 border-pink-200">
        <div className="relative h-64 bg-gradient-to-br from-pink-200 to-purple-200">
          <img
            src={pet.avatar}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-2xl">
              {pet.gender === "male" ? "🦁" : "🌸"}
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-3xl mb-2">{pet.name}</h3>
              <p className="text-gray-600 mb-2">
                {pet.breed} · {calculateAge(pet.birthday)}
              </p>
              <p className="text-sm text-gray-500">主人: {pet.owner}</p>
            </div>
            <Heart className="w-8 h-8 text-pink-400" fill="pink" />
          </div>

          {/* Personality Tags */}
          <div className="mb-4">
            <h4 className="text-sm text-gray-500 mb-2">性格标签</h4>
            <div className="flex flex-wrap gap-2">
              {pet.personality.map((trait, index) => (
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
          {pet.bio && (
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-2">自我介绍</h4>
              <p className="text-gray-700">{pet.bio}</p>
            </div>
          )}

          {/* Looking For */}
          {pet.lookingFor && (
            <div className="bg-pink-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <h4 className="text-sm">期望对象</h4>
              </div>
              <p className="text-sm text-gray-700">{pet.lookingFor}</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
              <Calendar className="w-6 h-6 text-pink-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">生日</p>
              <p className="text-sm">{pet.birthday}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <Wallet className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">总开支</p>
              <p className="text-sm">¥{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Cake className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">纪念日</p>
              <p className="text-sm">{anniversaries.length}个</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">开支记录</TabsTrigger>
          <TabsTrigger value="anniversaries">纪念日</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          {expenses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wallet className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">还没有开支记录</p>
                <Link to="/expenses">
                  <Button>去记账</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            expenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((expense) => (
                <Card key={expense.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{categoryIcons[expense.category]}</div>
                      <div>
                        <h4>{expense.description}</h4>
                        <p className="text-sm text-gray-500">{expense.date}</p>
                      </div>
                    </div>
                    <div className="text-lg">¥{expense.amount.toFixed(2)}</div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="anniversaries" className="space-y-4">
          {anniversaries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">还没有纪念日</p>
                <Link to="/memories">
                  <Button>添加纪念日</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            anniversaries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((anniversary) => (
                <Card key={anniversary.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4>{anniversary.title}</h4>
                      <Badge variant="outline">{anniversary.type === "birthday" ? "🎂" : anniversary.type === "adoption" ? "❤️" : "⭐"}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{anniversary.date}</p>
                    {anniversary.notes && (
                      <p className="text-sm text-gray-600">{anniversary.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
