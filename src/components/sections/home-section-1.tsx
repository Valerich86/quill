import { font_accent, font_logo } from "@/lib/fonts";
import Image from "next/image";

const images = [
  { src: "/travel.jpg", rotate: -5, top: 0 },
  { src: "/fashion.jpg", rotate: 5, top: -10 },
  { src: "/future.jpg", rotate: 15, top: 10 },
];

export default function HomeSection1() {
  return (
    <>
      <div className="w-screen min-h-screen absolute top-0 left-0">
        <div className="w-150 h-100 absolute bg-primary opacity-70 rotate-25 -left-30 top-[25%] lg:top-[55%] z-10"></div>
        <div className="w-[120%] h-[110vh] absolute bg-primary z-20 lg:-rotate-25 top-[35%] lg:top-[40%]"></div>
      </div>
      <section className="w-full h-screen flex items-center relative bg-light">
        <div className="w-full lg:w-1/2 px-offsetX h-full flex flex-col lg:justify-center lg:mt-20 mt-48 z-30">
          <h1
            className={`${font_logo.className} text-7xl lg:text-[200px] text-accent_1`}
          >
            Quill
          </h1>
          <h2
            className={`${font_accent.className} w-[90%] text-lg lg:text-5xl text-light`}
          >
            Пиши. Делись. Вдохновляй.
          </h2>
        </div>
        <div className="w-full h-2/3 absolute lg:left-[35%] top-[50%] lg:top-[25%] z-20">
          {images.map((item, i) => (
            <div
              key={i}
              className={`w-2/3 lg:w-1/4 h-2/3 lg:h-[110%] absolute rounded-2xl`}
              style={{
                left: `${i * 17}vw`,
                rotate: `${item.rotate}deg`,
                top: `-${i * 8}vh`,
                zIndex: -i,
                boxShadow: "2px -2px 25px -15px black"
              }}
            >
              <Image
                src={item.src}
                alt=""
                width={300}
                height={300}
                className={`h-full w-full object-cover object-center rounded-2xl`}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
