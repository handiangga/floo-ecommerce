import { Award, HeartHandshake, Scissors, Star, UsersRound } from "lucide-react";

const items = [
  { icon: UsersRound, value: "100K+", label: "Happy Customer" },
  { icon: Star, value: "4.9 Rating", label: "From 10K+ Review" },
  { icon: HeartHandshake, value: "500+", label: "Premium Collection" },
  { icon: Award, value: "Premium Quality", label: "Handpicked Materials" },
  { icon: Scissors, value: "Free Fitting", label: "Available in Jogja" },
];

export default function TrustBar() {
  return <section className="border-y border-[#e9e2d8] bg-[#fdfaf5]"><div className="container-custom grid divide-y divide-[#e9e2d8] py-2 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">{items.map(({ icon: Icon, value, label }) => <div key={value} className="flex items-center justify-center gap-3 px-4 py-4 lg:py-5"><Icon className="size-6 text-[#ad865f]" strokeWidth={1.35} /><div><p className="text-sm font-semibold">{value}</p><p className="text-[10px] text-muted-foreground">{label}</p></div></div>)}</div></section>;
}
