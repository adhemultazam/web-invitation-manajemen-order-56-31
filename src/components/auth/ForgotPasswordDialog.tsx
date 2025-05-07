
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ForgotPasswordDialogProps {
  disabled?: boolean;
}

export function ForgotPasswordDialog({ disabled = false }: ForgotPasswordDialogProps) {
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      toast.error("Masukkan alamat email yang valid");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 800));
      setResetEmailSent(true);
      toast.success("Link reset password telah dikirim");
    } catch (error) {
      toast.error("Gagal mengirim link reset password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="px-0 text-sm font-normal h-auto" disabled={disabled}>
          Lupa Password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            {resetEmailSent 
              ? "Email reset password telah dikirim. Silahkan cek inbox Anda."
              : "Masukkan email Anda untuk menerima tautan reset password."}
          </DialogDescription>
        </DialogHeader>
        
        {!resetEmailSent ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="contoh@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button 
                disabled={loading} 
                onClick={handleForgotPassword}
              >
                {loading ? "Mengirim..." : "Kirim Link Reset"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <DialogFooter>
            <DialogClose asChild>
              <Button>Tutup</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
