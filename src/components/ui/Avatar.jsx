import * as React from "react"

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Avatar = React.forwardRef(({ className, src, alt, fallback, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        className || "h-10 w-10"
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary font-medium text-white">
          {fallback || "?"}
        </div>
      )}
    </div>
  )
})
Avatar.displayName = "Avatar"

export { Avatar }
