import { QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/lib/theme";
import { TelegramProvider, useTelegram } from "@/lib/telegram";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/dashboard";
import WorkoutPage from "@/pages/workout";
import ProtocolPage from "@/pages/protocol";
import SettingsPage from "@/pages/settings-page";
import NotFoundPage from "@/pages/not-found";
import { LayoutDashboard, BookOpen, Settings, MessageCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

function BottomNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && (location === "/" || location === "")) return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-4">
        <Link href="/">
          <button
            className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid="nav-dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium">Главная</span>
          </button>
        </Link>
        <Link href="/protocol">
          <button
            className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
              isActive("/protocol") ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid="nav-protocol"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-medium">Протокол</span>
          </button>
        </Link>
        <Link href="/settings">
          <button
            className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
              isActive("/settings") ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid="nav-settings"
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium">Настройки</span>
          </button>
        </Link>
      </div>
    </nav>
  );
}

function AppShell() {
  const { isInTelegram } = useTelegram();

  // If not in Telegram, show prompt
  if (!isInTelegram) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold mb-2">Huberman Fitness Tracker</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
          Откройте приложение через Telegram бота{" "}
          <span className="text-primary font-medium">@Fittram_bot</span>
        </p>
        <div className="mt-8 p-4 rounded-lg bg-muted/50 text-xs text-muted-foreground max-w-xs">
          Это приложение работает только внутри Telegram как Mini App
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-lg mx-auto px-4 pt-4 pb-20">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/workout/:dayNumber/:date" component={WorkoutPage} />
          <Route path="/protocol" component={ProtocolPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <ThemeProvider>
          <Router hook={useHashLocation}>
            <AppShell />
            <Toaster />
          </Router>
        </ThemeProvider>
      </TelegramProvider>
    </QueryClientProvider>
  );
}
