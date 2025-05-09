
import { Theme } from "@/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteThemeDialogProps {
  open: boolean;
  theme: Theme | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteThemeDialog({ 
  open, 
  theme, 
  onOpenChange, 
  onConfirm 
}: DeleteThemeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Tema</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus tema "{theme?.name}"? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
