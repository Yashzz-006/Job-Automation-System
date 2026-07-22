// Soft drifting gradient blobs — ambient motion behind list sections.
// Blurred and low-opacity by design: it should read as light in the room,
// not shapes competing with the cards on top of it.

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-20 -left-16 w-[420px] h-[420px] rounded-full blur-3xl opacity-[0.15] animate-float-a"
        style={{ background: "radial-gradient(circle, var(--color-brand-blue), transparent 70%)" }}
      />
      <div
        className="absolute top-1/4 -right-20 w-[380px] h-[380px] rounded-full blur-3xl opacity-[0.12] animate-float-b"
        style={{ background: "radial-gradient(circle, var(--color-brand-purple), transparent 70%)" }}
      />
    </div>
  );
}