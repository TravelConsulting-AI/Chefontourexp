import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-[#1a1a1a] text-white border border-white/10 shadow-lg rounded-lg",
          description: "text-white/70",
          actionButton:
            "bg-[#D4A574] text-white hover:bg-[#C19563]",
          cancelButton:
            "bg-white/10 text-white/70 hover:bg-white/20",
          error:
            "!bg-red-950 !border-red-800 !text-red-200",
          success:
            "!bg-emerald-950 !border-emerald-800 !text-emerald-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
