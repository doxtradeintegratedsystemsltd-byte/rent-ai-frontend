import { User } from "@/types/user";
import Image from "next/image";

const Profile = ({ user }: { user: User }) => {
  const userDetails = {
    user: user.userType,
    name: user.firstName + " " + user.lastName,
    email: user.email,
    phone: user.phoneNumber,
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-xs font-medium uppercase">
          Display Photo
        </p>
        <div className="h-30 w-30 rounded-full">
          <Image
            src={user.photoUrl || "/images/big-avatar.png"}
            alt="Admin Avatar"
            width={1200}
            height={1200}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            User
          </p>
          <p className="text-foreground font-medium uppercase">
            {userDetails.user}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Name
          </p>
          <p className="text-foreground font-medium">{userDetails.name}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Email
          </p>
          <p className="text-foreground font-medium">{userDetails.email}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Phone
          </p>
          <p className="text-foreground font-medium">
            {userDetails.phone || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
