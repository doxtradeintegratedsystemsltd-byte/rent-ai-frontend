const Card = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`border-border rounded-md border p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
