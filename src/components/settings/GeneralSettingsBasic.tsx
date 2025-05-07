
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneralSettingsBasicProps {
  appName: string;
  sidebarTitle: string;
  onAppNameChange: (value: string) => void;
  onSidebarTitleChange: (value: string) => void;
}

export function GeneralSettingsBasic({ 
  appName, 
  sidebarTitle, 
  onAppNameChange, 
  onSidebarTitleChange 
}: GeneralSettingsBasicProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="appName">Nama Aplikasi</Label>
        <Input
          id="appName"
          value={appName}
          onChange={(e) => onAppNameChange(e.target.value)}
          placeholder="Order Management"
        />
        <p className="text-xs text-muted-foreground">
          Nama yang akan ditampilkan pada tab browser
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sidebarTitle">Judul Sidebar</Label>
        <Input
          id="sidebarTitle"
          value={sidebarTitle}
          onChange={(e) => onSidebarTitleChange(e.target.value)}
          placeholder="Order Management"
        />
        <p className="text-xs text-muted-foreground">
          Teks yang akan ditampilkan di bagian atas sidebar
        </p>
      </div>
    </div>
  );
}
