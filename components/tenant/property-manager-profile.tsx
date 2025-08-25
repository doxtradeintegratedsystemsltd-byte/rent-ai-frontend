import Avatar from "../ui/avatar";
import { User } from "@/types/user";

interface PropertyManagerProfileProps {
  manager?: Pick<
    User,
    "firstName" | "lastName" | "email" | "phoneNumber" | "photoUrl"
  > | null;
  isLoading?: boolean;
}

const PropertyManagerProfile = ({
  manager,
  isLoading,
}: PropertyManagerProfileProps) => {
  const fullName = manager
    ? `${manager.firstName} ${manager.lastName}`
    : isLoading
      ? "Loading..."
      : "Unknown";
  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar src={manager?.photoUrl || "/images/big-avatar.png"} size="xl" />
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{fullName}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Email
          </p>
          <p className="text-foreground text-sm font-medium">
            {manager?.email || (isLoading ? "Loading..." : "N/A")}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Phone
          </p>
          <p className="text-foreground text-sm font-medium">
            {manager?.phoneNumber || (isLoading ? "Loading..." : "N/A")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagerProfile;
