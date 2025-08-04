import Avatar from "../ui/avatar";

const PropertyManagerProfile = () => {
  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <Avatar src="/images/big-avatar.png" size="xl" />
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Bala Joseph</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Email
          </p>
          <p className="text-foreground text-sm font-medium">
            joseph@gmail.com
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Phone
          </p>
          <p className="text-foreground text-sm font-medium">08123456789</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagerProfile;
