import OnboardingSlide from "@/components/OnboardingSlide";

export default function Onboarding1() {
  return (
    <OnboardingSlide
      image={require("../../assets/images/download.png")}
      headline="Get customized weight loss and health diets."
      body=""
      index={0}
      total={3}
      nextHref="/(intro)/onb-2"
      skipHref="/(auth)/sign-up"
    />
  );
}
