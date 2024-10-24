import { PanelsTopLeft } from "lucide-react";
import { ModeToggle } from "../../components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";


const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-[2rem] z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
        <div className="container h-14 flex items-center min-w-[90vw]">
          <a
            href="/"
            className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
          >
            <PanelsTopLeft className="w-6 h-6 mr-3" />
            <span className="font-bold">Twinsies/Digital Twin</span>
            <span className="sr-only">Twinsies/Digital Twin</span>
          </a>
          <nav className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 bg-background"
              asChild
            >
              <a href="https://github.com/Twinsies-2024-FYP/fyp">
                <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
              </a>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-57px-97px)] flex-1 ">
        <div className="container relative pb-10 min-w-[100vw] ">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              FYP Twinsies Digital Twin Project
            </h1>
            <span className="max-w-[650px] text-center text-lg font-ultralight text-foreground">
              An AI-driven platform to enhance the evaluation of student
              performance, assisting TAs and Professors in delivering precise
              and efficient academic assessments.
            </span>
            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
              <Button variant="default" asChild>
                <Link
                  to="/"
                  className="flex items-center no-underline"
                >
                  Demo
                  <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
            </div>
          </section>
          <div className="w-full flex justify-center relative">
            {/* Supposedly the images*/}
            <img src="/twinsies-icon.png" alt="twinsies icon"/>
          </div>
        </div>
      </main>
      <footer className="flex justify-items-start py-6 md:py-0 border-t border-border/40">
        <div className="container flex flex-col p-6 gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built using{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              React Vite and OpenAI API
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/Twinsies-2024-FYP/fyp"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub.
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
