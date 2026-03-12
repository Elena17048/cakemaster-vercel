"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function CourseCarousel({ images, title }: any) {

  const plugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  function onSelect() {
    if (!api) return;
    setCurrent(api?.selectedScrollSnap() ?? 0);
  }

  return (
    <div className="relative">

      <Carousel
        plugins={[plugin.current]}
        opts={{ loop: true }}
        setApi={(carouselApi) => {
          setApi(carouselApi);
          carouselApi?.on("select", onSelect);
        }}
        className="w-full"
      >

        <CarouselContent>

          {images.map((img: string, index: number) => (
            <CarouselItem key={index}>

              <div className="overflow-hidden rounded-xl">

                <Image
                  src={img}
                  alt={`${title} ${index + 1}`}
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="w-full h-[640px] object-contain"
                />

              </div>

            </CarouselItem>
          ))}

        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />

      </Carousel>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-4">

        {images.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              current === index
                ? "bg-black scale-110"
                : "bg-gray-300"
            }`}
          />
        ))}

      </div>

    </div>
  );
}