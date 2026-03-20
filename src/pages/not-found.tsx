import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
      <div className="text-6xl font-bold text-muted-foreground/30">404</div>
      <h1 className="text-xl font-bold">Страница не найдена</h1>
      <p className="text-sm text-muted-foreground">
        Запрошенная страница не существует.
      </p>
      <Link href="/">
        <Button variant="outline" size="sm">
          <Home className="w-4 h-4 mr-2" />
          На главную
        </Button>
      </Link>
    </div>
  );
}
