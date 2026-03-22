import Link from "next/link";
import { Phone, Mail, Info, Linkedin } from "lucide-react";
import { Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#f3efe7] text-[#4a4036] mt-24 border-t border-[#e1d8cb]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          
          {/* INFORMACE */}
          <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#3b322a] font-semibold">
              <Info className="h-4 w-4" />
              <span>Informace</span>
            </div>
            <p>Elena Alexeeva</p>
            <p>IČO: 17730727</p>
            <p>Provozovna: Na hutích 7, Praha – Bubeneč</p>
          </div>

          {/* KONTAKTY */}
          <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#3b322a] font-semibold">
              <Phone className="h-4 w-4" />
              <span>Kontakty</span>
            </div>
            <p>
              Telefon:{" "}
              <a href="tel:+420774351057" className="hover:text-white">
                +420 774 351 057
              </a>
            </p>
            <p>
              E-mail:{" "}
              <a href="mailto:info@akemaster.cz" className="hover:text-white">
                info@cakemaster.cz
              </a>
            </p>
          </div>

          {/* SOCIAL */}
          <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#3b322a] font-semibold">
              <Phone className="h-4 w-4" />
              <span>Sledujte mě</span>
            </div>

            <div className="flex gap-4">
              <Link
                href="https://www.instagram.com/cakemaster.prague/"
                target="_blank"
                className="hover:text-[#3b322a]"
              >
                <Instagram />
              </Link>
              <Link
                href="https://www.facebook.com/CakeMasterPrague/"
                target="_blank"
                className="hover:text-[#3b322a]"
              >
                <Facebook />
              </Link>
              <Link
                href="https://www.linkedin.com/in/elena-alexeeva-4a103713a/?locale=en_US"
                target="_blank"
                className="hover:text-[#3b322a]"
              >
                <Linkedin />
              </Link>
            </div>
          </div>
        </div>

        {/* SPODNÍ ŘÁDEK */}
        <div className="border-t border-[#e6dfd4] mt-10 pt-6 text-center text-sm text-[#6b5e51]">
  © {new Date().getFullYear()} cakemaster.cz. Všechna práva vyhrazena.
</div>
      </div>
    </footer>
  );
}
