export default function shouldDoubleBuffer(
  arg0: () => void,
  arg1: () => void,
): void {
  requestAnimationFrame(() => {
    arg0();
    requestAnimationFrame(() => requestAnimationFrame(arg1));
  });
}