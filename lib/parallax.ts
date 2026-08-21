// How far a layer has to be moved for it to read as travelling at a different
// speed from the page carrying it.
//
// The page moves a layer up by `travelled` on its own. To have it read as
// having moved up by `rate` of that, it is pushed back down by the difference:
// rate below 1 lags behind, above 1 runs ahead, and at 1 nothing is moved.
export const parallaxOffset = (travelled: number, rate: number) =>
  travelled * (1 - rate);
