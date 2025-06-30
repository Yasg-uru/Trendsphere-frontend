import React from "react";

function LoaderIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}

interface LoaderProps {
  title?: string;
}

const Loader: React.FunctionComponent<LoaderProps> = ({ title = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-xl">
      <div className="flex animate-spin items-center justify-center rounded-full bg-primary p-4 text-primary-foreground shadow-lg">
        <LoaderIcon className="h-8 w-8" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{title}</p>
    </div>
  );
};

export default Loader;
