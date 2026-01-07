import { OrnamentalDivider } from "@/components/DecorativeSvgs";

export default function Footer() {
  return (
    <footer className="relative px-6 pb-12 pt-10 text-center">
      <div className="mx-auto max-w-xl">
        <OrnamentalDivider className="mx-auto" />
        <p className="mt-4 text-base text-ink-soft">
          Que cada detalhe desta noite seja um capítulo de ternura e elegância em nossa história.
        </p>
      </div>
    </footer>
  );
}
