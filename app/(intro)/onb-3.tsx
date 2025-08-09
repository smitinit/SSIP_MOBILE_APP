import OnboardingSlide from "@/components/OnboardingSlide";

export default function Onboarding3() {
  return (
    <OnboardingSlide
      image={require("../../assets/images/download.png")}
      headline="Book an appointment for an online consultation."
      index={2}
      total={4}
      nextHref="/(intro)/onb-4"
      skipHref="/(auth)/sign-up"
    />
  );
}
