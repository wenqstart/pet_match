import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-8xl mb-4">🐾</div>
      <h2 className="text-3xl mb-2">404</h2>
      <p className="text-gray-600 mb-6">找不到这个页面</p>
      <Link to="/">
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
          <Home className="w-4 h-4 mr-2" />
          返回首页
        </Button>
      </Link>
    </div>
  );
}
