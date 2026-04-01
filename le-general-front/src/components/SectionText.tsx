interface SectionTextProps {
    title: string;
    description: string;
}

export default function SectionText({ title, description }: SectionTextProps) {
    return (
        <section className="bg-[#231f1d] text-white py-24 px-16 md:px-16 lg:px-32 flex flex-col items-center">
            <h2 className="font-mono text-xl md:text-2xl uppercase tracking-[0.4em] mb-12 max-w-4xl leading-loose text-center w-full" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                {title}
            </h2>

            <p className="font-sans text-[16px] leading-loose max-w-5xl text-stone-300 tracking-wide text-left w-full" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                {description}
            </p>
        </section>
    );
}