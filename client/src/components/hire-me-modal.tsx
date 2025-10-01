import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface HireMeModalProps {
  children: React.ReactNode;
  buttonClassName?: string;
}

export default function HireMeModal({ children, buttonClassName }: HireMeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("project");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    timeline: "",
    message: "",
    projectType: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: activeTab,
          source: "hire_me_modal"
        }),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "I'll get back to you within 24 hours.",
          variant: "default",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          budget: "",
          timeline: "",
          message: "",
          projectType: ""
        });
        setIsOpen(false);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName || "bg-gold-400 text-gray-900 hover:bg-gold-500"}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gold-400">Let's Work Together</DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("project")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "project"
                ? "bg-gold-400 text-gray-900"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <i className="fas fa-rocket mr-2"></i>
            Start a Project
          </button>
          <button
            onClick={() => setActiveTab("call")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "call"
                ? "bg-gold-400 text-gray-900"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <i className="fas fa-phone mr-2"></i>
            Book a Call
          </button>
          <button
            onClick={() => setActiveTab("payment")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "payment"
                ? "bg-gold-400 text-gray-900"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <i className="fas fa-credit-card mr-2"></i>
            Pay Now
          </button>
        </div>

        {/* Project Form */}
        {activeTab === "project" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Needed *
                </label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="website">Website Development</SelectItem>
                    <SelectItem value="ai">AI Implementation</SelectItem>
                    <SelectItem value="app">App Development</SelectItem>
                    <SelectItem value="music">Piano Services</SelectItem>
                    <SelectItem value="basketball">Basketball Training</SelectItem>
                    <SelectItem value="combo">Multiple Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Range
                </label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="under-500">Under $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                    <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                    <SelectItem value="over-5000">Over $5,000</SelectItem>
                    <SelectItem value="discuss">Let's discuss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeline
                </label>
                <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="When do you need this?" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1-week">Within 1 week</SelectItem>
                    <SelectItem value="1-month">Within 1 month</SelectItem>
                    <SelectItem value="3-months">Within 3 months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Details *
              </label>
              <Textarea
                required
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Tell me about your project, goals, and any specific requirements..."
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold-400 text-gray-900 hover:bg-gold-500 font-semibold py-3"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Start My Project
                </>
              )}
            </Button>
          </form>
        )}

        {/* Book a Call */}
        {activeTab === "call" && (
          <div className="text-center py-6">
            <i className="fas fa-calendar-alt text-5xl text-gold-400 mb-4"></i>
            <h3 className="text-xl font-bold text-gold-400 mb-3">Schedule a Free Consultation</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Let's discuss your project over a 30-minute call. I'll provide insights and a custom quote.
            </p>
            <div className="space-y-3">
              <a
                href="https://calendly.com/deshawngoodwyn"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gold-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gold-500 transition-colors"
              >
                <i className="fas fa-external-link-alt mr-2"></i>
                Book Free Consultation
              </a>
              <p className="text-xs text-gray-400">
                Available Monday-Friday, 9 AM - 6 PM EST
              </p>
            </div>
          </div>
        )}

        {/* Payment Options */}
        {activeTab === "payment" && (
          <div className="py-6">
            <h3 className="text-xl font-bold text-gold-400 mb-6">Quick Payment Options</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="font-bold text-white mb-3">Fixed Services</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">One-Page Website</span>
                    <span className="text-gold-400 font-bold">$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">AI Chatbot</span>
                    <span className="text-gold-400 font-bold">$600</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Music Essential</span>
                    <span className="text-gold-400 font-bold">$100</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  <i className="fas fa-credit-card mr-2"></i>
                  Pay for Fixed Service
                </Button>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="font-bold text-white mb-3">Custom Amount</h4>
                <p className="text-gray-300 mb-4">
                  For deposits, partial payments, or custom arrangements.
                </p>
                <div className="space-y-3">
                  <Input
                    type="number"
                    placeholder="Amount ($)"
                    className="bg-gray-600 border-gray-500"
                  />
                  <Input
                    placeholder="Payment description"
                    className="bg-gray-600 border-gray-500"
                  />
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <i className="fas fa-money-bill mr-2"></i>
                  Send Payment Link
                </Button>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300 text-center">
                <i className="fas fa-shield-alt mr-2 text-green-400"></i>
                Secure payments powered by Stripe. All transactions are encrypted and protected.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}