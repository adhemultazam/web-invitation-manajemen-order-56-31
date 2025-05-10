
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";

interface ProfileFormData {
  name: string;
  email: string;
  profileImage?: string;
}

export function SupabaseProfileSettings() {
  const { profile, updateProfile, user } = useSupabaseAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || user?.email || "",
      profileImage: profile?.profile_image || ""
    }
  });
  
  // Update form when profile changes
  useEffect(() => {
    if (profile || user) {
      reset({
        name: profile?.name || "",
        email: profile?.email || user?.email || "",
        profileImage: profile?.profile_image || ""
      });
    }
  }, [profile, user, reset]);
  
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      
      await updateProfile({
        name: data.name,
        email: data.email,
        profile_image: data.profileImage
      });
      
      toast.success("Profil berhasil diperbarui");
    } catch (error: any) {
      toast.error("Gagal memperbarui profil", {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              placeholder="Nama lengkap"
              {...register("name", { required: "Nama harus diisi" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email harus diisi" })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profileImage">URL Foto Profil</Label>
            <Input
              id="profileImage"
              placeholder="https://example.com/avatar.png"
              {...register("profileImage")}
            />
            <p className="text-xs text-muted-foreground">
              Masukkan URL gambar untuk foto profil Anda
            </p>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
