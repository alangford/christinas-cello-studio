import { Img } from "../components/Img";
import { PageHeader } from "../components/PageHeader";
import { routeMeta } from "../content/site";
import { usePageMeta } from "../usePageMeta";


const soundcloud =
  "https://soundcloud.com/user-489951656/sets/christinas-senior-recital/s-EiY6x";

const soundcloudEmbed = import.meta.env.VITE_SOUND_CLOUD_URL;
  


export default function Recordings() {
  usePageMeta(routeMeta("/sample-recordings"));

  return (
    <>
      <PageHeader title="My Recordings" />
      <section className="section">
        <div className="container split split--photo-first">
          <Img name="recordings" className="portrait portrait--sticky" eager />
          <div className="recordings">
            <article className="recording">
              <h2 className="recording__title">Fall 2022 Recital</h2>
              <iframe
                className="embed"
                src="https://www.youtube-nocookie.com/embed/bJWGiclzVUY"
                title="Fall 2022 Recital"
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              />
              <a className="recording__link" href="https://youtu.be/bJWGiclzVUY">
                https://youtu.be/bJWGiclzVUY
              </a>
            </article>

            <article className="recording">
              <h2 className="recording__title">BYU Senior Recital</h2>
              <iframe
                className="embed embed--audio"
                src={soundcloudEmbed}
                title="Christina's Senior Recital on SoundCloud"
                loading="lazy"
                allow="autoplay"
              />
              <a className="recording__link" href={soundcloud}>
                Christina&rsquo;s Senior Recital (Soundcloud)
              </a>
            </article>

            <article className="recording">
              <h2 className="recording__title">Bach Cello Suite 6, Prelude</h2>
              <iframe
                className="embed"
                src="https://www.youtube-nocookie.com/embed/_hrMgw_yVtY"
                title="Bach Cello Suite 6, Prelude"
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              />
              <a className="recording__link" href="https://www.youtube.com/watch?v=_hrMgw_yVtY">
                Bach Cello Suite 6 Prelude - YouTube
              </a>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
