export interface HeroCta {
  text: string;
  href: string;
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface HeroVariantProps {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  stats?: HeroStat[];
}
