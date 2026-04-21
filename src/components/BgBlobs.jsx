// Ambient background blobs used across all pages
const BgBlobs = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow" />
    <div className="absolute top-1/2 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
    <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-brand-700/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
  </div>
);

export default BgBlobs;
