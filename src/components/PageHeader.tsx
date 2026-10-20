import { image, type ImageKey } from "../content/images";

type Props = {
  title: string;
  texture?: ImageKey;
};

export function PageHeader({ title, texture }: Props) {
  const style = texture
    ? {
        backgroundImage: `linear-gradient(rgb(41 56 47 / 0.88), rgb(41 56 47 / 0.84)), url("${image(texture).src}")`,
      }
    : undefined;

  return (
    <section className="page-header" style={style}>
      <div className="container">
        <h1 className="page-header__title">{title}</h1>
      </div>
    </section>
  );
}
