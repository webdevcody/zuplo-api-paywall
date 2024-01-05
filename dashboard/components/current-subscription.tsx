export const CurrentSubscriptionUsage = ({
  usage,
}: {
  usage:
    | {
        total_usage: number;
      }
    | undefined;
}) => {
  if (!usage) {
    return <p>Loading usage</p>;
  }

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <p>
        You have made <b>{usage.total_usage}</b> requests this month
      </p>
    </div>
  );
};
