import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  square?: boolean;
}

const sizes = {
  sm: "h-10 w-10 text-xs rounded-lg",
  md: "h-12 w-12 text-sm rounded-xl",
  lg: "h-14 w-14 text-base rounded-xl",
};

export function MemberAvatar({
  name,
  photoUrl,
  size = "md",
  square = true,
}: MemberAvatarProps) {
  return (
    <Avatar className={cn(sizes[size], square && "rounded-xl")}>
      {photoUrl && (
        <AvatarImage
          src={photoUrl.startsWith("/") ? photoUrl : photoUrl}
          alt={name}
          className="object-cover"
        />
      )}
      <AvatarFallback
        className={cn(
          "rounded-xl bg-blue-50 text-blue-600 font-semibold dark:bg-blue-500/20 dark:text-blue-400",
          sizes[size]
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
