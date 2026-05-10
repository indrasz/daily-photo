type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-[14px] border border-surface-line bg-white shadow-card p-6">
      <h3 className="text-lg font-medium text-ink-deep mb-2">{title}</h3>
      <p className="text-sm text-ink-muted leading-5">{description}</p>
    </div>
  );
}
