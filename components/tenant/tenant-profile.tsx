interface TenantDetail {
  label: string;
  value: string;
}

interface TenantProfileProps {
  tenantDetails: TenantDetail[];
}

const TenantProfile = ({ tenantDetails }: TenantProfileProps) => {
  return (
    <div className="flex flex-col gap-6">
      {tenantDetails.map((item) => (
        <div className="flex flex-col gap-2" key={item.label}>
          <p className="text-muted-foreground text-xs font-medium uppercase">
            {item.label}
          </p>
          <p className="text-foreground text-sm font-medium">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TenantProfile;
