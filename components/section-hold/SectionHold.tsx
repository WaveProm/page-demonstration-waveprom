import type { ReactNode } from "react";

// Somewhere to land. The screen it holds stays at the top for one more gesture
// of scroll before the page moves on, so a section that has just been arrived
// at is actually seen, whole, instead of leaving the moment it is reached.
//
// A sticky element is held by the box that contains it, and that box is the
// screen plus the hold. Nothing else: no margin trick, because what follows
// has to scroll after this section rather than out from under it.
const SectionHold = ({ children }: { children: ReactNode }) => (
  <div className="relative snap-start snap-always">
    <div className="sticky top-0 h-screen">{children}</div>

    <div className="h-[60vh]" />
  </div>
);

export default SectionHold;
