export default function SectionContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-4 mb-12 pt-12 md:mx-16">{children}</div>;
}
