
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";
import { ProfileSettingsForm } from "./ProfileSettingsForm";
import { PasswordSettingsForm } from "./PasswordSettingsForm";

export function AccountSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Pengaturan Akun
        </CardTitle>
        <CardDescription>
          Kelola detail akun dan password Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Profile Settings */}
          <ProfileSettingsForm />
          
          {/* Password Settings */}
          <PasswordSettingsForm />
        </div>
      </CardContent>
    </Card>
  );
}
