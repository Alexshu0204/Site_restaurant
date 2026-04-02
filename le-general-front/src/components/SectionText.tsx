import type { ReactNode } from "react";

// This component is a reusable section with a title, an optional description, and optional children content.

// ? means "optional"

// ReactNode is a type that can be anything that React can render: a string, a number, an element, an array of elements, etc. It's used here to allow for maximum flexibility in what can be passed as title, description, and children.

interface SectionTextProps {
    title: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
}

export default function SectionText({
    title,
    description,
    children,
    className = "",
    titleClassName = "",
    descriptionClassName = "",
}: SectionTextProps) {
    const sectionClasses = [
        "bg-[#231f1d] text-white py-24 px-6 md:px-16 lg:px-32 flex flex-col items-center",
        className,
    ].filter(Boolean).join(" ");

    const titleClasses = [
        "font-mono text-xl md:text-2xl uppercase tracking-[0.4em] mb-12 max-w-4xl leading-loose text-center w-full",
        titleClassName,
    ].filter(Boolean).join(" ");

    const descriptionClasses = [
        "font-sans text-[16px] leading-loose max-w-5xl text-stone-300 tracking-wide w-full",
        descriptionClassName,
    ].filter(Boolean).join(" ");

    return (
        <section className={sectionClasses}>
            <h2 className={titleClasses} style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
                {title}
            </h2>

            {description && (
                <p className={descriptionClasses} style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
                    {description}
                </p>
            )}

            {children}
        </section>
    );
}