export function money(value: string | number) {
  const amount = Number(value);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "MGA", maximumFractionDigits: 0 }).format(Number.isFinite(amount) ? amount : 0);
}
export function shortDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}
