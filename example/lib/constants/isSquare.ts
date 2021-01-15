export default function isSquare(n: number): boolean {
  const i = Math.sqrt(n);
  return n >= 3 && Number.isInteger(i) && (i * i) === n;
}
