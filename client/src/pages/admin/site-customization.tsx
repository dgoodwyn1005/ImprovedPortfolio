import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette, 
  Type, 
  Settings, 
  Eye, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  Undo2,
  Monitor,
  Smartphone,
  RefreshCw
} from "lucide-react";
import type { SiteConfig, ThemeConfig, PageContent } from "@shared/schema";

export default function SiteCustomization() {
  const [selectedSection, setSelectedSection] = useState("hero");
  const [selectedPage, setSelectedPage] = useState("home");
  const [previewMode, setPreviewMode] = useState(false);
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response: any = await apiRequest("/api/admin/session", "GET");
        if (response && response.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          window.location.href = "/admin";
        }
      } catch (error) {
        window.location.href = "/admin";
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // Color picker state
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [colorProperty, setColorProperty] = useState("");

  // Fetch configurations (only when authenticated)
  const { data: siteConfigs = [], isLoading: configsLoading } = useQuery<SiteConfig[]>({
    queryKey: ["/api/admin/site-config"],
    enabled: isAuthenticated,
  });

  const { data: pageContents = [], isLoading: contentsLoading } = useQuery<PageContent[]>({
    queryKey: ["/api/admin/page-content"],
    enabled: isAuthenticated,
  });

  const { data: themes = [], isLoading: themesLoading } = useQuery<ThemeConfig[]>({
    queryKey: ["/api/admin/themes"],
    enabled: isAuthenticated,
  });

  const { data: activeTheme } = useQuery<ThemeConfig>({
    queryKey: ["/api/theme/active"],
    enabled: isAuthenticated,
  });

  // Mutations for configurations
  const createConfigMutation = useMutation({
    mutationFn: (config: any) => apiRequest("/api/admin/site-config", "POST", config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-config"] });
      toast({ title: "Configuration created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create configuration", variant: "destructive" });
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: ({ id, ...config }: any) => 
      apiRequest(`/api/admin/site-config/${id}`, "PUT", config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-config"] });
      toast({ title: "Configuration updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update configuration", variant: "destructive" });
    },
  });

  const deleteConfigMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/site-config/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-config"] });
      toast({ title: "Configuration deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete configuration", variant: "destructive" });
    },
  });

  // Mutations for page content
  const updateContentMutation = useMutation({
    mutationFn: ({ id, ...content }: any) => 
      apiRequest(`/api/admin/page-content/${id}`, "PUT", content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-content"] });
      toast({ title: "Content updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update content", variant: "destructive" });
    },
  });

  // Mutations for themes
  const createThemeMutation = useMutation({
    mutationFn: (theme: any) => apiRequest("/api/admin/themes", "POST", theme),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/themes"] });
      toast({ title: "Theme created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create theme", variant: "destructive" });
    },
  });

  const updateThemeMutation = useMutation({
    mutationFn: ({ id, ...theme }: any) => 
      apiRequest(`/api/admin/themes/${id}`, "PUT", theme),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/themes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/theme/active"] });
      toast({ title: "Theme updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update theme", variant: "destructive" });
    },
  });

  const activateThemeMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/themes/${id}/activate`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/themes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/theme/active"] });
      toast({ title: "Theme activated successfully!" });
      // Refresh the page to apply new theme
      window.location.reload();
    },
    onError: () => {
      toast({ title: "Failed to activate theme", variant: "destructive" });
    },
  });

  // Helper functions
  const getConfigsBySection = (section: string) => {
    return siteConfigs.filter((config: SiteConfig) => config.section === section);
  };

  const getContentsByPage = (page: string) => {
    return pageContents.filter((content: PageContent) => content.page === page);
  };

  const handleColorUpdate = (property: string, color: string) => {
    if (!activeTheme?.id) return;
    
    const updatedColors = {
      ...(activeTheme.colors as Record<string, any> || {}),
      [property]: color
    };

    updateThemeMutation.mutate({
      id: activeTheme.id,
      colors: updatedColors
    });
  };

  // Apply theme colors dynamically
  useEffect(() => {
    if (activeTheme?.colors && typeof activeTheme.colors === 'object') {
      const root = document.documentElement;
      Object.entries(activeTheme.colors as Record<string, any>).forEach(([property, color]) => {
        if (typeof color === 'string') {
          root.style.setProperty(`--${property}`, color);
        }
      });
    }
  }, [activeTheme]);

  if (isCheckingAuth || !isAuthenticated || configsLoading || contentsLoading || themesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8" data-testid="site-customization-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
            <Settings className="h-10 w-10" />
            Site Customization
          </h1>
          <p className="text-muted-foreground mt-2">
            Powerful tools to customize your site appearance, content, and behavior
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Device View Toggle */}
          <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
            <Button
              variant={deviceView === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDeviceView("desktop")}
              data-testid="desktop-view-toggle"
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </Button>
            <Button
              variant={deviceView === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDeviceView("mobile")}
              data-testid="mobile-view-toggle"
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </Button>
          </div>
          
          {/* Preview Toggle */}
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
            data-testid="preview-toggle"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Exit Preview" : "Preview Mode"}
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            data-testid="refresh-site"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Site
          </Button>
        </div>
      </div>

      {/* Main Customization Interface */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" data-testid="content-tab">
            <Type className="h-4 w-4 mr-2" />
            Content Editor
          </TabsTrigger>
          <TabsTrigger value="themes" data-testid="themes-tab">
            <Palette className="h-4 w-4 mr-2" />
            Theme Manager
          </TabsTrigger>
          <TabsTrigger value="colors" data-testid="colors-tab">
            <Palette className="h-4 w-4 mr-2" />
            Color Customizer
          </TabsTrigger>
          <TabsTrigger value="advanced" data-testid="advanced-tab">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </TabsTrigger>
        </TabsList>

        {/* Content Editor Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Page Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select Page to Edit</CardTitle>
                <CardDescription>Choose a page to customize its content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger data-testid="page-selector">
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Page</SelectItem>
                    <SelectItem value="about">About Page</SelectItem>
                    <SelectItem value="ai">AI Services</SelectItem>
                    <SelectItem value="music">Music Services</SelectItem>
                    <SelectItem value="basketball">Basketball Services</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <Label>Available Sections</Label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(getContentsByPage(selectedPage).map((c: PageContent) => c.section))).map((section: string) => (
                      <Badge
                        key={section}
                        variant={selectedSection === section ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedSection(section)}
                        data-testid={`section-${section}`}
                      >
                        {section}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Edit Content</CardTitle>
                <CardDescription>
                  Customize text, buttons, and other content elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {getContentsByPage(selectedPage)
                  .filter(content => content.section === selectedSection)
                  .map((content: PageContent) => (
                  <div key={content.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{content.contentKey}</h4>
                      <Switch
                        checked={content.isVisible || false}
                        onCheckedChange={(checked) => {
                          updateContentMutation.mutate({
                            id: content.id,
                            isVisible: checked
                          });
                        }}
                        data-testid={`visibility-${content.id}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${content.id}`}>Title</Label>
                        <Input
                          id={`title-${content.id}`}
                          value={content.title || ""}
                          onChange={(e) => {
                            updateContentMutation.mutate({
                              id: content.id,
                              title: e.target.value
                            });
                          }}
                          placeholder="Enter title..."
                          data-testid={`title-input-${content.id}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`subtitle-${content.id}`}>Subtitle</Label>
                        <Input
                          id={`subtitle-${content.id}`}
                          value={content.subtitle || ""}
                          onChange={(e) => {
                            updateContentMutation.mutate({
                              id: content.id,
                              subtitle: e.target.value
                            });
                          }}
                          placeholder="Enter subtitle..."
                          data-testid={`subtitle-input-${content.id}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`description-${content.id}`}>Description</Label>
                      <Textarea
                        id={`description-${content.id}`}
                        value={content.description || ""}
                        onChange={(e) => {
                          updateContentMutation.mutate({
                            id: content.id,
                            description: e.target.value
                          });
                        }}
                        placeholder="Enter description..."
                        rows={3}
                        data-testid={`description-input-${content.id}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`button-text-${content.id}`}>Button Text</Label>
                        <Input
                          id={`button-text-${content.id}`}
                          value={content.buttonText || ""}
                          onChange={(e) => {
                            updateContentMutation.mutate({
                              id: content.id,
                              buttonText: e.target.value
                            });
                          }}
                          placeholder="Enter button text..."
                          data-testid={`button-text-input-${content.id}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`button-link-${content.id}`}>Button Link</Label>
                        <Input
                          id={`button-link-${content.id}`}
                          value={content.buttonLink || ""}
                          onChange={(e) => {
                            updateContentMutation.mutate({
                              id: content.id,
                              buttonLink: e.target.value
                            });
                          }}
                          placeholder="Enter button link..."
                          data-testid={`button-link-input-${content.id}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Theme Manager Tab */}
        <TabsContent value="themes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Themes</CardTitle>
                <CardDescription>Manage and switch between different site themes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {themes.map((theme: ThemeConfig) => (
                  <div
                    key={theme.id}
                    className={`p-4 border rounded-lg ${
                      theme.isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {theme.name}
                          {theme.isActive && <Badge>Active</Badge>}
                          {theme.isDefault && <Badge variant="outline">Default</Badge>}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {Object.keys((theme.colors as Record<string, any>) || {}).length} color properties
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!theme.isActive && (
                          <Button
                            size="sm"
                            onClick={() => activateThemeMutation.mutate(theme.id)}
                            disabled={activateThemeMutation.isPending}
                            data-testid={`activate-theme-${theme.id}`}
                          >
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`edit-theme-${theme.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create New Theme</CardTitle>
                <CardDescription>Start with a blank theme or copy an existing one</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => {
                    createThemeMutation.mutate({
                      name: `Custom Theme ${(themes as ThemeConfig[]).length + 1}`,
                      colors: {
                        primary: "#3b82f6",
                        secondary: "#64748b",
                        accent: "#f59e0b",
                        background: "#ffffff",
                        foreground: "#000000"
                      },
                      fonts: {},
                      spacing: {}
                    });
                  }}
                  disabled={createThemeMutation.isPending}
                  className="w-full"
                  data-testid="create-theme-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Theme
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Color Customizer Tab */}
        <TabsContent value="colors" className="space-y-6">
          {activeTheme ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Color Properties</CardTitle>
                  <CardDescription>
                    Customize individual color properties for the active theme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeTheme.colors && typeof activeTheme.colors === 'object' &&
                    Object.entries(activeTheme.colors as Record<string, any>).map(([property, color]) => (
                      <div key={property} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <Label className="font-medium">{property}</Label>
                          <p className="text-sm text-muted-foreground">{color as string}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border-2"
                            style={{ backgroundColor: color as string }}
                          />
                          <Input
                            type="color"
                            value={color as string}
                            onChange={(e) => handleColorUpdate(property, e.target.value)}
                            className="w-16 h-8 p-1"
                            data-testid={`color-input-${property}`}
                          />
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>See your color changes in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 p-4 border rounded bg-background">
                    <div className="h-20 bg-primary rounded flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold">Primary Color</span>
                    </div>
                    <div className="h-16 bg-secondary rounded flex items-center justify-center">
                      <span className="text-secondary-foreground">Secondary Color</span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Primary Button</Button>
                      <Button variant="outline" className="flex-1">Secondary Button</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No active theme found. Please activate a theme first.</p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    createThemeMutation.mutate({
                      name: "Default Theme",
                      colors: {
                        primary: "#3b82f6",
                        secondary: "#64748b",
                        accent: "#f59e0b",
                        background: "#ffffff",
                        foreground: "#000000"
                      },
                      fonts: {},
                      spacing: {},
                      isDefault: true,
                      isActive: true
                    });
                  }}
                >
                  Create Default Theme
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Advanced Settings Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
              <CardDescription>
                Manage advanced site settings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {["hero", "about", "services", "features", "contact"].map((section) => (
                  <Card key={section}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg capitalize">{section}</CardTitle>
                      <CardDescription>
                        {getConfigsBySection(section).length} configurations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {getConfigsBySection(section).slice(0, 3).map((config: SiteConfig) => (
                        <div key={config.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{config.key}</span>
                          <Badge variant="outline">{config.type}</Badge>
                        </div>
                      ))}
                      {getConfigsBySection(section).length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{getConfigsBySection(section).length - 3} more...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}