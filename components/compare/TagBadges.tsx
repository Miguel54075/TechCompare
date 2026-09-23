import { Badge } from "@/components/ui/badge";
import { PROFILES } from "@/lib/recommend";
import type { ProfileId } from "@/lib/types";

export function TagBadges({ tags }: { tags: ProfileId[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => {
        const { label, icon: Icon, className } = PROFILES[t];
        return (
          <Badge key={t} className={className}>
            <Icon className="size-3" />
            {label}
          </Badge>
        );
      })}
    </div>
  );
}
