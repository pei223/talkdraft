import { Text, TextProps } from "@chakra-ui/react";

interface Props extends TextProps {
  children: React.ReactNode;
  level?: "main" | "sub";
}
export default function Description({
  children,
  level = "main",
  ...props
}: Props) {
  return (
    <Text
      color={level === "main" ? "gray.600" : "gray.500"}
      fontSize={level === "main" ? "0.9rem" : "0.7rem"}
      {...props}
    >
      {children}
    </Text>
  );
}
