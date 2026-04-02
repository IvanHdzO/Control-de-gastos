import {
  Home, ShoppingCart, Car, Zap, Film, Heart, BookOpen, Smartphone,
  Shirt, CreditCard, Package,
} from "lucide-react";

export const CATEGORIES = [
  { id: "vivienda", label: "Vivienda", Icon: Home, color: "#E8927C" },
  { id: "alimentacion", label: "Alimentación", Icon: ShoppingCart, color: "#7CC6E8" },
  { id: "transporte", label: "Transporte", Icon: Car, color: "#E8D07C" },
  { id: "servicios", label: "Servicios", Icon: Zap, color: "#A57CE8" },
  { id: "entretenimiento", label: "Entretenimiento", Icon: Film, color: "#E87CA5" },
  { id: "salud", label: "Salud", Icon: Heart, color: "#7CE8B8" },
  { id: "educacion", label: "Educación", Icon: BookOpen, color: "#7C8AE8" },
  { id: "suscripciones", label: "Suscripciones", Icon: Smartphone, color: "#E8A57C" },
  { id: "ropa", label: "Ropa", Icon: Shirt, color: "#C47CE8" },
  { id: "deudas", label: "Deudas/Créditos", Icon: CreditCard, color: "#E87C7C" },
  { id: "otros", label: "Otros", Icon: Package, color: "#8BE87C" },
];

export const PRIORITY = { essential: "Esencial", reducible: "Reducible", eliminable: "Eliminable" };
export const PRIORITY_COLORS = { essential: "#4A9B7F", reducible: "#C49B4A", eliminable: "#C44A4A" };
