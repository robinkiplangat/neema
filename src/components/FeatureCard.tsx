import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-neema-secondary/10 hover:shadow-md transition-all duration-300 group hover:border-neema-primary/20">
      <div className="mb-6 text-neema-primary group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 text-neema-text group-hover:text-neema-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
