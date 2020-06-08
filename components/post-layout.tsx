export default function PostLayout({ preview, children }) {
  return (
    <>
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
    </>
  );
}
