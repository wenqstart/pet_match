import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Pet, Expense } from "../types";
import { mockExpenses } from "../data/mockData";
import { Plus, TrendingUp, Wallet, Calendar } from "lucide-react";
import { toast } from "sonner";

const categoryIcons: Record<string, string> = {
  food: "🍖",
  medical: "💊",
  toys: "🎾",
  grooming: "✂️",
  other: "📦",
};

const categoryLabels: Record<string, string> = {
  food: "食品",
  medical: "医疗",
  toys: "玩具",
  grooming: "美容",
  other: "其他",
};

export default function Expenses() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    petId: "",
    category: "food" as Expense["category"],
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const storedPets = localStorage.getItem("pets");
    if (storedPets) {
      setPets(JSON.parse(storedPets));
    }

    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      setExpenses(mockExpenses);
      localStorage.setItem("expenses", JSON.stringify(mockExpenses));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.petId || !formData.amount || !formData.description) {
      toast.error("请填写完整信息");
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      petId: formData.petId,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    toast.success("记账成功！");
    setIsDialogOpen(false);
    setFormData({
      petId: "",
      category: "food",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p.id === petId);
    return pet?.name || "未知宠物";
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const thisMonthExpenses = expenses
    .filter((exp) => {
      const expDate = new Date(exp.date);
      const now = new Date();
      return (
        expDate.getMonth() === now.getMonth() &&
        expDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">宠物记账</h2>
          <p className="text-gray-600">记录每一笔宠物开支</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              添加记账
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加开支记录</DialogTitle>
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
                <Label htmlFor="category">分类</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: Expense["category"]) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {categoryIcons[key]} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">金额 (元)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  placeholder="记录一下这笔开支..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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

              <Button type="submit" className="w-full">
                保存
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">总开支</p>
                <p className="text-2xl">¥{totalExpenses.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">本月开支</p>
                <p className="text-2xl">¥{thisMonthExpenses.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">记录数</p>
                <p className="text-2xl">{expenses.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Summary */}
      <Card>
        <CardHeader>
          <CardTitle>分类统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(categoryTotals).map(([category, total]) => (
              <div
                key={category}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center"
              >
                <div className="text-3xl mb-2">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </p>
                <p className="font-semibold">¥{total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <CardTitle>开支记录</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">还没有记账记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {categoryIcons[expense.category]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4>{expense.description}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getPetName(expense.petId)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>
                            {categoryLabels[expense.category]}
                          </span>
                          <span>·</span>
                          <span>{expense.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-lg">
                      ¥{expense.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
