import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Admin from "@/pages/admin";
import SiteCustomization from "@/pages/admin/site-customization";
import AIServices from "@/pages/ai";
import MusicServices from "@/pages/music";
import BasketballServices from "@/pages/basketball";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
import ThankYouAI from "@/pages/thank-you-ai";
import ThankYouMusic from "@/pages/thank-you-music";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/computer" component={AIServices}/>
      <Route path="/ai" component={AIServices}/>
      <Route path="/music" component={MusicServices}/>
      <Route path="/basketball" component={BasketballServices}/>
      <Route path="/pricing" component={Pricing}/>
      <Route path="/contact" component={Contact}/>
      <Route path="/thank-you-ai" component={ThankYouAI}/>
      <Route path="/thank-you-music" component={ThankYouMusic}/>
      <Route path="/admin" component={Admin}/>
      <Route path="/admin/site-customization" component={SiteCustomization}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    initGA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
