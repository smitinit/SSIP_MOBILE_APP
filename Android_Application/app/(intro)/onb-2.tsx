import OnboardingSlide from "@/components/OnboardingSlide";

export default function Onboarding2() {
  return (
    <OnboardingSlide
      image={require("../../assets/images/favicon.jpeg")}
      headline="Simple steps to a healthier, newer you."
      index={1}
      total={3}
      nextHref="/(intro)/onb-3"
      skipHref="/(auth)/sign-up"
    />
  );
}
