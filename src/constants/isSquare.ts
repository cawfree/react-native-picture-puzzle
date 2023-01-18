export default function isSquare(n: number): boolean {
  const i = Math.sqrt(n);
  return i >= 2 && Number.isInteger(i) && (i * i) === n;
}
