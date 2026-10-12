import { image, type ImageKey } from "../content/images";

type Props = {
  name: ImageKey;
  alt?: string;
  className?: string;
  eager?: boolean;
};

export function Img({ name, alt, className, eager = false }: Props) {
  const { src, width, height, alt: defaultAlt } = image(name);
  return (
    <img
      className={className}
      src={src}
      width={width}
      height={height}
      alt={alt ?? defaultAlt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
