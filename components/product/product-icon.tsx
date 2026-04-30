import {
  Activity,
  Boxes,
  Cpu,
  Droplets,
  Flame,
  Gauge,
  Radio,
  ShieldCheck,
  Thermometer,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react"
import type { Product } from "@/lib/types"

const iconMap: Record<Product["icon"], LucideIcon> = {
  Activity,
  Boxes,
  Cpu,
  Droplets,
  Flame,
  Gauge,
  Radio,
  ShieldCheck,
  Thermometer,
  Wind,
  Wrench,
  Zap,
}

export function ProductIcon({
  name,
  className,
  style,
}: {
  name: Product["icon"]
  className?: string
  style?: React.CSSProperties
}) {
  const Cmp = iconMap[name] ?? Boxes
  return <Cmp className={className} style={style} aria-hidden="true" />
}
