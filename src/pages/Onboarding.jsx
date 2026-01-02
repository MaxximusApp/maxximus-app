import OnboardingQuiz from '../components/features/OnboardingQuiz'

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Vamos conhecer você melhor
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Este questionário nos ajudará a criar uma experiência personalizada para você.
            Leva apenas alguns minutos.
          </p>
        </div>
        
        <OnboardingQuiz />
      </div>
    </div>
  )
}