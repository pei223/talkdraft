import { Button, ButtonProps } from "@chakra-ui/react";

interface Props extends ButtonProps {
  level?: "primary" | "secondary";
}

export default function AppButton({
  children,
  level = "primary",
  ...props
}: Props) {
  return (
    <Button
      variant={level === "primary" ? "solid" : "outline"}
      color={level === "primary" ? "white" : "blue.700"}
      backgroundColor={{
        base: level === "primary" ? "blue.700" : "white",
        _hover: level === "primary" ? "blue.600" : "gray.200",
      }}
      borderColor="blue.500"
      {...props}
      size="sm"
      px="4"
    >
      {children}
    </Button>
  );
}
