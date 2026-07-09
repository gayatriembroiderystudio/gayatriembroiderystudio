import { useSettings } from "@/hooks/useSettings";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppFab() {
  const { data: settings, isLoading } = useSettings();

  if (isLoading || !settings?.phone) return null;

  return (
    <a
      href={`https://wa.me/${settings.phone.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95"
    >
      <FaWhatsapp className="h-9 w-9 text-white" />
    </a>
  );
}
