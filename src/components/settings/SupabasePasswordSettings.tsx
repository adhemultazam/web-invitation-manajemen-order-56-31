
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

export function SupabasePasswordSettings() {
  const { updatePassword } = useSupabaseAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });
  
  const watchPassword = watch("password");
  
  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await updatePassword(data.password);
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Password berhasil diperbarui");
      reset();
    } catch (error: any) {
      toast.error("Gagal memperbarui password", {
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
            <Label htmlFor="password">Password Baru</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { 
                required: "Password harus diisi",
                minLength: {
                  value: 6,
                  message: "Password minimal 6 karakter"
                }
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", { 
                required: "Konfirmasi password harus diisi",
                validate: value => 
                  value === watchPassword || "Password tidak cocok"
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Perbarui Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
