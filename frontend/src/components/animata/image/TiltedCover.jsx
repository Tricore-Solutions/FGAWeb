import { cn } from "../../../lib/utils";

/**
 * TiltedCover Component
 * @param {Object} props
 * @param {"left"|"right"} [props.direction="left"] - Direction of the tilt
 * @param {React.ReactNode} [props.cover] - The content to be displayed on the cover
 * @param {boolean} [props.tiltCover=true] - Determines if the cover should tilt with the background
 * @param {React.ReactNode} [props.children] - The content to be displayed on the background
 * @param {Object} [props.image] - The image to be displayed on the cover. Takes precedence over children
 * @param {string} [props.className] - Additional CSS classes
 */
export default function TiltedCover({
  children,
  direction = "left",
  tiltCover = true,
  cover,
  image,
  className,
  ...props
}) {
  const tiltLeft = direction === "left";
  const factor = tiltLeft ? 1 : -1;

  return (
    // Container is flexible — size is controlled by parent via className/width/height.
    // Allow overflow so 3D transforms do not get clipped vertically.
    <div className={cn("flex items-center justify-center overflow-visible", className)} {...props}>
      <div className="group relative h-full w-full">
        {/* Background content */}
        <div
          className="pointer-events-none relative h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-500 ease-slow group-hover:!transform-none"
          style={{
            transform: `perspective(400px) rotateY(${factor * 20}deg) scale(0.85) translateX(${-factor * 20}%)`,
            transformOrigin: 'center center',
          }}
        >
          {children}
          <div className="absolute inset-0 h-full w-full bg-gray-400/10 transition-all group-hover:bg-transparent" />
        </div>

        {/* Cover Content */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full rounded-xl border-[6px] border-white bg-white transition-all delay-75 duration-500 ease-slow group-hover:!transform-none group-hover:opacity-0",
            {
              "group-hover:left-[200%]": tiltLeft,
              "group-hover:-left-[200%]": !tiltLeft,
            },
          )}
          style={{
            transform: tiltCover ? `perspective(400px) rotateY(${factor * 20}deg)` : undefined,
            transformOrigin: 'center center',
          }}
        >
          <div className="h-full w-full rounded-md object-cover">
            {image ? (
              <img
                src={image.src || ""}
                alt={image.alt || ""}
                {...image}
                className={cn("h-full w-full rounded-md object-cover", image?.className)}
              />
            ) : (
              cover
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

