import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";

export function SettingsSection() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    storeName: "ROC DZ",
    phone: "+213 555 123 456",
    whatsapp: "+213 555 123 456",
    email: "contact@rocdz.com",
    address: "Algiers, Algeria",
    facebook: "https://facebook.com/rocdz",
    instagram: "https://instagram.com/rocdz",
    tiktok: "https://tiktok.com/@rocdz",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your store settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Store Settings</h2>
        <Button onClick={handleSave} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Basic store details displayed to customers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" name="storeName" value={settings.storeName} onChange={handleChange} className="bg-input/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Support Email</Label>
              <Input id="email" name="email" type="email" value={settings.email} onChange={handleChange} className="bg-input/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Physical Address</Label>
              <Textarea id="address" name="address" value={settings.address} onChange={handleChange} className="bg-input/50 min-h-[100px]" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Contact Numbers</CardTitle>
              <CardDescription>Phone numbers for calls and WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={settings.phone} onChange={handleChange} className="bg-input/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input id="whatsapp" name="whatsapp" value={settings.whatsapp} onChange={handleChange} className="bg-input/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Links to your social media profiles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input id="facebook" name="facebook" value={settings.facebook} onChange={handleChange} className="bg-input/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input id="instagram" name="instagram" value={settings.instagram} onChange={handleChange} className="bg-input/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok URL</Label>
                <Input id="tiktok" name="tiktok" value={settings.tiktok} onChange={handleChange} className="bg-input/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
