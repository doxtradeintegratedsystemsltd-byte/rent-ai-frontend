import Image from "next/image";

const Profile = () => {
  const userDetails = {
    user: "ADMIN - Property Manager",
    name: "Bala Joseph",
    email: "bjoseph@gmail.com",
    phone: "08112345678",
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-xs font-medium uppercase">
          Display Photo
        </p>
        <div className="h-30 w-30 rounded-full">
          <Image
            src="/images/big-avatar.png"
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
          <p className="text-foreground font-medium">{userDetails.user}</p>
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
          <p className="text-foreground font-medium">{userDetails.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
