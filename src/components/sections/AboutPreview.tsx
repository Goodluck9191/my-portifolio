import Link from "next/link";

export function AboutPreview() {
  return (
    <section className="border-b border-[#22223A] bg-[#08080E] py-16 md:py-20">
      <div className="mx-auto max-w-[1100px] px-4">
        <div className="flex flex-col items-start gap-10 md:flex-row md:gap-20">
          <div className="w-full shrink-0 md:w-80">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-[#22223A] bg-[#16162A] md:w-80">
              <span className="font-mono text-sm text-[#7A7A9A]">
                [Your Photo Here]
              </span>
            </div>
          </div>

          <div className="flex max-w-xl flex-col gap-5">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#6C63FF]">
              About Me
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white md:text-[32px]">
              I&apos;m Goodluck Prosper
            </h2>
            <div className="flex flex-col gap-4 font-sans text-[16px] leading-[1.8] text-[#7A7A9A]">
              <p>
                I&apos;m a full stack developer from Tanzania with 3 years of
                experience building websites and web applications for clients. I
                specialize in React and Next.js on the frontend, Node.js with
                Express on the backend, and I use Python for automation and
                scripting.
              </p>
              <p>
                What I love most is the problem-solving process — taking a
                vague idea and shaping it into a clear, functional product that
                people actually enjoy using. Every project teaches me something
                new, and I bring that growth into the next one.
              </p>
              <p>
                I&apos;m currently open to freelance and full-time
                opportunities where I can contribute meaningfully, work with
                great people, and continue building things that matter.
              </p>
            </div>
            <Link
              href="/about"
              className="group flex items-center gap-1.5 font-sans text-sm font-medium text-[#6C63FF] transition-all duration-200 hover:text-[#00D4FF]"
            >
              More About Me{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
