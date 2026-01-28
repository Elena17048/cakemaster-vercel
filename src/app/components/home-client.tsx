"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { CustomCakeForm } from "@/app/components/custom-cake-form";
import { OrderQuestionnaireModal } from "@/app/components/order-questionnaire-modal";

export default function HomeClient() {
  const lang = "cs";

  const { ref: galleryRef, inView: galleryInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [isCustomCakeFormOpen, setCustomCakeFormOpen] = useState(false);
  const [isQuestionnaireOpen, setQuestionnaireOpen] = useState(false);

  const openCustomCakeForm = () => {
    setQuestionnaireOpen(false);
    setCustomCakeFormOpen(true);
  };

  return (
    <div className="flex flex-col">
      {/* celý zbytek tvého JSX beze změn */}
    </div>
  );
}
