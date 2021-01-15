export default function isSquare(n: number): boolean {
  const i = Math.sqrt(n);
  return n > 1 && Number.isInteger(i) && (i * i) === n;
}
