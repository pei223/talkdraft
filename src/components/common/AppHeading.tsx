import { Heading, HeadingProps } from "@chakra-ui/react";

interface Props extends HeadingProps {
  children: React.ReactNode;
  level?: "main" | "sub";
}
export default function AppHeading({
  children,
  level = "main",
  ...props
}: Props) {
  return (
    <Heading
      color={level === "main" ? "gray.800" : "gray.600"}
      size={level === "main" ? "xl" : "lg"}
      {...props}
    >
      {children}
    </Heading>
  );
}
