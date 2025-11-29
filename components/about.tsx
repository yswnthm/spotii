import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const projectCategories = [
    {
        title: "~ Technical Projects",
        projects: [
            {
                title: "OpenBook - Learning/Reading in this new era.",
                link: "https://goopenbook.in",
            },
            {
                title: "PEC.UP - A place for student resources",
                link: "https://pecup.in",
            },
            {
                title: "SafeLINK - An QR based details retriever",
                link: "https://safelink.pecup.in",
            }
        ],
    },
    {
        title: "~ Cool Projects",
        projects: [
            {
                title: "OpenBook - Landing Page",
                link: "https://page.openbook.in",
            },
            {
                title: "yet to build, this is my GitHub",
                link: "https://github.com/yswnthm",
            },
        ],
    },
];

export default function About() {
    return (
        <section
            id="about"
            aria-labelledby="about-heading"
            className="px-8 md:px-16 lg:px-24 h-screen min-h-screen snap-start flex flex-col justify-center"
        >
            <div className="max-w-3xl mx-auto flex flex-col min-h-[400px]">
                <div className="motion-safe:animate-fade-in-up">
                    <h2
                        id="about-heading"
                        className="text-2xl md:text-3xl font-semibold mb-6 text-center"
                    >
                        About
                    </h2>
                </div>

                <div className="motion-safe:animate-fade-in-up motion-safe:animate-delay-200 flex-1 flex flex-col">
                    <div className="prose max-w-none text-muted-foreground leading-relaxed flex-1">
                        <p className="mb-4">
                            Spotii is your personal AI DJ, designed to turn your vibe into a stunning playlist instantly. Whether you're looking for focus, energy, or relaxation, Spotii understands your prompt and curates the perfect musical backdrop for any moment.
                        </p>

                        <p className="mb-4">
                            Powered by advanced AI algorithms, Spotii analyzes your text descriptions to select tracks that match your desired atmosphere. No more endless scrolling or manual curation—just describe what you want to hear, and let the magic happen.
                        </p>
                        <p className="mb-1">I do love writing, and creating cool projects!</p>
                        <p className="mb-4">here are few of my other projects</p>
                        <div className="mt-8">
                            <h3 className="font-medium mb-2"></h3>
                            <Accordion type="single" collapsible className="w-full">
                                {projectCategories.map((category, index) => (
                                    <AccordionItem
                                        key={category.title}
                                        value={`item-${index}`}
                                        className="border-b-0"
                                    >
                                        <AccordionTrigger className="py-2 text-sm hover:no-underline hover:text-primary justify-start gap-2">
                                            <span>{category.title}</span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-1 pl-4 border-l border-border/40 ml-1 my-1">
                                                {category.projects.map((project, projectIndex) => (
                                                    <a
                                                        key={projectIndex}
                                                        href={project.link}
                                                        className="block py-1 px-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                                    >
                                                        {project.title}
                                                    </a>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
