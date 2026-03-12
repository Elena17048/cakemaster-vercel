"use client";

import { useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CourseCarousel({ images, title }: any) {
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  return (
    <div className="relative">

      <Carousel
        opts={{ loop: true }}
        plugins={[autoplay.current]}
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
                  className="w-full h-[640px] object-contain"
                />

              </div>

            </CarouselItem>
          ))}

        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />

      </Carousel>

    </div>
  );
}