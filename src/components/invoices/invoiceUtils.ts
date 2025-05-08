
import html2canvas from "html2canvas";
import { toast } from "sonner";

export const downloadInvoiceImage = async (elementRef: React.RefObject<HTMLDivElement>, invoiceNumber: string) => {
  if (!elementRef.current) return;
  
  try {
    const canvas = await html2canvas(elementRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
    
    const image = canvas.toDataURL("image/png", 1.0);
    const downloadLink = document.createElement("a");
    downloadLink.href = image;
    downloadLink.download = `invoice-${invoiceNumber}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error("Error generating invoice image:", error);
  }
};

export const copyInvoiceToClipboard = async (elementRef: React.RefObject<HTMLDivElement>) => {
  if (!elementRef.current) return;
  
  try {
    const canvas = await html2canvas(elementRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
    
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          // Create a ClipboardItem and write it to clipboard
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          toast.success("Invoice berhasil disalin ke clipboard");
        } catch (error) {
          console.error("Error copying to clipboard:", error);
          toast.error("Gagal menyalin ke clipboard", { 
            description: "Browser Anda mungkin tidak mendukung fitur ini"
          });
        }
      }
    }, "image/png");
  } catch (error) {
    console.error("Error generating invoice image for clipboard:", error);
    toast.error("Gagal menyalin invoice");
  }
};
