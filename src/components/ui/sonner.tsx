
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-2xl rounded-2xl p-4",
          description: "group-[.toast]:text-white/90",
          actionButton:
            "group-[.toast]:bg-white/20 group-[.toast]:text-white group-[.toast]:border-white/30 group-[.toast]:rounded-xl group-[.toast]:backdrop-blur-sm",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white/90 group-[.toast]:border-white/20 group-[.toast]:rounded-xl group-[.toast]:backdrop-blur-sm",
          closeButton: "group-[.toast]:text-white/70 group-[.toast]:hover:text-white",
          success: "group-[.toast]:bg-green-500/20 group-[.toast]:border-green-500/30",
          error: "group-[.toast]:bg-red-500/20 group-[.toast]:border-red-500/30",
          warning: "group-[.toast]:bg-yellow-500/20 group-[.toast]:border-yellow-500/30",
          info: "group-[.toast]:bg-blue-500/20 group-[.toast]:border-blue-500/30",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
