import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../lib/api";

// Constants
const BOOKING_MAX_GUESTS = 12;
type BookingStep = 1 | 2 | 3;
const LUNCH_START = 12;
const LUNCH_END = 15;
const DINNER_START = 19;
const DINNER_END = 23;

// Generate time slots (every 15 minutes)
const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      slots.push(`${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
    }
  }
  return slots;
};

const LUNCH_SLOTS = generateTimeSlots(LUNCH_START, LUNCH_END);
const DINNER_SLOTS = generateTimeSlots(DINNER_START, DINNER_END);

export default function MainBookingPage() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    reservationDate: "",
    reservationType: "dinner",
    timeSlot: "20:00",
    guestsNumber: 2,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequest: "",
    acceptedTerms: false,
  });

  // Stepper state
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);

  // UI state
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Derived state
  const timeSlots = formData.reservationType === "lunch" ? LUNCH_SLOTS : DINNER_SLOTS;
  const minDate = new Date().toISOString().split("T")[0];

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Reset time slot if switching reservation type
      if (name === "reservationType") {
        updated.timeSlot = updated.reservationType === "lunch" ? LUNCH_SLOTS[0] : DINNER_SLOTS[0];
      }

      return updated;
    });
    setErrorMessage("");
  };

  // Handle time slot click
  const handleTimeSlotClick = (slot: string) => {
    setFormData((prev) => ({ ...prev, timeSlot: slot }));
  };

  // Step validation
  const isStep1Valid = (): boolean => {
    return !!(formData.reservationDate && formData.timeSlot && formData.guestsNumber);
  };

  const isStep2Valid = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !!(formData.firstName && formData.lastName && emailRegex.test(formData.email));
  };

  // Navigation
  const handleNextStep = (): void => {
    handleStepClick((currentStep + 1) as BookingStep);
  };

  const handlePrevStep = (): void => {
    handleStepClick((currentStep - 1) as BookingStep);
  };

  // Navigate to a specific step (with validation)
  const handleStepClick = (targetStep: BookingStep): void => {
    // Can always go back to previous steps
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      setErrorMessage("");
      setStatus("idle");
      return;
    }

    // Can only go forward if current step is valid
    if (targetStep > currentStep) {
      if (currentStep === 1 && !isStep1Valid()) {
        setErrorMessage("Veuillez remplir tous les champs de cette étape");
        setStatus("error");
        return;
      }
      if (currentStep === 2 && !isStep2Valid()) {
        setErrorMessage("Veuillez remplir correctement tous les champs de contact");
        setStatus("error");
        return;
      }
      setCurrentStep(targetStep);
      setErrorMessage("");
      setStatus("idle");
    }
  };

  // Format datetime string for API
  const formatReservationDateTime = (): string => {
    const date = formData.reservationDate;
    const time = formData.timeSlot;
    return `${date}T${time}:00`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final validation
    if (!formData.acceptedTerms) {
      setErrorMessage("Veuillez accepter les conditions d'utilisation");
      setStatus("error");
      return;
    }

    if (!isStep1Valid() || !isStep2Valid()) {
      setErrorMessage("Veuillez remplir tous les champs requis");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");

      // Call public booking endpoint
      await api.post("/bookings/public", {
        reservationDate: formatReservationDateTime(),
        guestsNumber: parseInt(formData.guestsNumber.toString()),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        specialRequest: formData.specialRequest || null,
      });

      setStatus("success");

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/", { state: { bookingConfirmed: true } });
      }, 2000);
    } catch (error: any) {
      console.error("Booking error:", error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Une erreur est survenue. Veuillez réessayer."
      );
    }
  };

  // Success message
  if (status === "success") {
    return (
      <div className="flex min-h-screen flex-col bg-[#1a1715] text-white">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="rounded-lg bg-green-950/30 border border-green-700/50 p-8 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold text-green-400 mb-4">✓ Réservation confirmée !</h2>
            <p className="text-stone-300 mb-2">
              Numéro de réservation: <span className="font-mono font-bold text-green-300">{formData.firstName}</span>
            </p>
            <p className="text-stone-400 text-sm">Redirection vers l'accueil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1715] text-white">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="font-mono text-4xl font-bold uppercase tracking-widest mb-2">
              Réservation
            </h1>
            <p className="text-stone-400 text-sm">
              Étape {currentStep} sur 3
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono text-stone-500 uppercase">Progression</span>
              <span className="text-xs font-mono text-stone-500">{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600 transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
            {/* Step Indicators */}
            <div className="flex justify-between mt-6">
              {[1, 2, 3].map((step) => {
                // Determine if step is accessible
                const isCompleted = step < currentStep;
                const isCurrent = step === currentStep;
                const canAccess =
                  step === 1 ||
                  (step === 2 && isStep1Valid()) ||
                  (step === 3 && isStep1Valid() && isStep2Valid());
                const isClickable = isCurrent || isCompleted || canAccess;

                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleStepClick(step as BookingStep)}
                    disabled={!isClickable}
                    className="flex flex-col items-center group"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm transition-all ${
                        isCurrent
                          ? "bg-orange-600 text-white scale-110 shadow-lg"
                          : isCompleted
                          ? "bg-green-700/50 text-green-300 cursor-pointer hover:bg-green-700/70"
                          : canAccess
                          ? "bg-stone-700 text-stone-300 cursor-pointer hover:bg-stone-600"
                          : "bg-stone-800 text-stone-600 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {isCompleted ? "✓" : step}
                    </div>
                    <p className="text-xs font-mono text-stone-500 mt-2">
                      {step === 1 && "Réservation"}
                      {step === 2 && "Contact"}
                      {step === 3 && "Confirmation"}
                    </p>
                    {isClickable && !isCurrent && (
                      <p className="text-xs text-stone-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isCompleted ? "Modifier" : "Continuer"}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {status === "error" && errorMessage && (
            <div className="mb-8 rounded-lg bg-red-950/30 border border-red-700/50 p-4 text-center">
              <p className="text-red-300 text-sm">⚠ {errorMessage}</p>
            </div>
          )}

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1: Reservation Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-mono text-2xl font-bold uppercase tracking-widest text-orange-600 mb-6">
                    Détails de réservation
                  </h2>

                  {/* Reservation Type */}
                  <div className="mb-8">
                    <label htmlFor="reservationType" className="block font-mono text-sm font-bold uppercase tracking-widest text-stone-300 mb-4">
                      Type de réservation
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({
                          ...prev,
                          reservationType: "lunch",
                          timeSlot: LUNCH_SLOTS[0],
                        }))}
                        className={`flex-1 py-4 px-6 rounded-lg font-mono text-sm font-bold uppercase tracking-widest transition-all ${
                          formData.reservationType === "lunch"
                            ? "bg-orange-600 text-white shadow-lg scale-105"
                            : "bg-stone-800 text-stone-400 hover:bg-stone-700"
                        }`}
                      >
                        🍽️ Déjeuner
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({
                          ...prev,
                          reservationType: "dinner",
                          timeSlot: DINNER_SLOTS[0],
                        }))}
                        className={`flex-1 py-4 px-6 rounded-lg font-mono text-sm font-bold uppercase tracking-widest transition-all ${
                          formData.reservationType === "dinner"
                            ? "bg-orange-600 text-white shadow-lg scale-105"
                            : "bg-stone-800 text-stone-400 hover:bg-stone-700"
                        }`}
                      >
                        🌙 Dîner
                      </button>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mb-8">
                    <label htmlFor="reservationDate" className="block font-mono text-sm font-bold uppercase tracking-widest text-stone-300 mb-3">
                      Quelle date souhaitez-vous ?
                    </label>
                    <input
                      type="date"
                      id="reservationDate"
                      name="reservationDate"
                      value={formData.reservationDate}
                      onChange={handleChange}
                      min={minDate}
                      required
                      aria-required="true"
                      className="w-full bg-stone-900 border border-stone-600 rounded-lg px-4 py-4 text-white font-mono placeholder-stone-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition text-lg"
                    />
                  </div>

                  {/* Time Slot */}
                  <div className="mb-8">
                    <label htmlFor="timeSlot" className="block font-mono text-sm font-bold uppercase tracking-widest text-stone-300 mb-4">
                      À quelle heure ?
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleTimeSlotClick(slot)}
                          className={`py-3 px-3 rounded-lg font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                            formData.timeSlot === slot
                              ? "bg-orange-600 text-white shadow-lg scale-110"
                              : "bg-stone-800 text-stone-400 hover:bg-stone-700"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guests Number */}
                  <div>
                    <label htmlFor="guestsNumber" className="block font-mono text-sm font-bold uppercase tracking-widest text-stone-300 mb-3">
                      Combien de personnes ?
                    </label>
                    <select
                      id="guestsNumber"
                      name="guestsNumber"
                      value={formData.guestsNumber}
                      onChange={handleChange}
                      required
                      className="w-full bg-stone-900 border border-stone-600 rounded-lg px-4 py-4 text-white font-mono focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition text-lg"
                    >
                      {Array.from({ length: BOOKING_MAX_GUESTS }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num} className="bg-stone-900">
                          {num} {num === 1 ? "personne" : "personnes"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-mono text-2xl font-bold uppercase tracking-widest text-orange-600 mb-6">
                    Qui êtes-vous ?
                  </h2>

                  {/* First Name */}
                  <div className="mb-8">
                    <label htmlFor="firstName" className="block font-mono text-sm font-bold uppercase tracking-widest text-stone-300 mb-3">
                      Votre prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="Jean"
                      className="w-full bg-stone-900 border border-stone-600 rounded-lg px-4 py-4 text-white font-mono placeholder-stone-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition text-lg"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="mb-8">
                    <label htmlFor="lastName" className="block font-mono text-sm font-bold uppercase tracking-widest text-stone-300 mb-3">
                      Votre nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Dupont"
                      className="w-full bg-stone-900 border border-stone-600 rounded-lg px-4 py-4 text-white font-mono placeholder-stone-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition text-lg"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-8">
                    <label htmlFor="email" className="block font-mono text-sm font-bold uppercase tracking-widest text-stone-300 mb-3">
                      Votre email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="jean@example.com"
                      className="w-full bg-stone-900 border border-stone-600 rounded-lg px-4 py-4 text-white font-mono placeholder-stone-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition text-lg"
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-8">
                    <label htmlFor="phone" className="block font-mono text-sm font-bold uppercase tracking-widest text-stone-300 mb-3">
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 1 23 45 67 89"
                      className="w-full bg-stone-900 border border-stone-600 rounded-lg px-4 py-4 text-white font-mono placeholder-stone-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition text-lg"
                    />
                  </div>

                  {/* Special Request */}
                  <div>
                    <label htmlFor="specialRequest" className="block font-mono text-sm font-bold uppercase tracking-widest text-stone-300 mb-3">
                      Demande spéciale (optionnel)
                    </label>
                    <textarea
                      id="specialRequest"
                      name="specialRequest"
                      value={formData.specialRequest}
                      onChange={handleChange}
                      placeholder="Régime alimentaire, allergie, événement spécial, etc."
                      maxLength={1000}
                      rows={3}
                      className="w-full bg-stone-900 border border-stone-600 rounded-lg px-4 py-4 text-white font-mono placeholder-stone-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition resize-none"
                    />
                    <p className="text-xs text-stone-500 mt-2">
                      {formData.specialRequest.length}/1000 caractères
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <h2 className="font-mono text-2xl font-bold uppercase tracking-widest text-orange-600 mb-6">
                  Confirmez votre réservation
                </h2>

                {/* Summary Box */}
                <div className="bg-stone-800/50 border border-orange-600/30 rounded-lg p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-2">Service</p>
                      <p className="text-xl font-bold text-white">
                        {formData.reservationType === "lunch" ? "🍽️ Déjeuner" : "🌙 Dîner"}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-2">Date</p>
                      <p className="text-xl font-bold text-white">
                        {new Date(formData.reservationDate).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-2">Heure</p>
                      <p className="text-xl font-bold text-white">{formData.timeSlot}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-2">Personnes</p>
                      <p className="text-xl font-bold text-white">{formData.guestsNumber}</p>
                    </div>
                  </div>

                  <hr className="border-stone-700" />

                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-3">Contact</p>
                    <p className="text-lg font-bold text-white">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-stone-300 text-sm">{formData.email}</p>
                    {formData.phone && <p className="text-stone-300 text-sm">{formData.phone}</p>}
                  </div>

                  {formData.specialRequest && (
                    <>
                      <hr className="border-stone-700" />
                      <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-2">Note</p>
                        <p className="text-stone-200 italic">{formData.specialRequest}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-4 cursor-pointer bg-stone-800/30 border border-stone-700 rounded-lg p-6">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 bg-stone-900 border border-stone-600 rounded accent-orange-500 cursor-pointer"
                  />
                  <span className="text-sm text-stone-300">
                    J'accepte les{" "}
                    <a href="/mentions-legales" className="text-orange-500 hover:text-orange-400 underline">
                      conditions d'utilisation
                    </a>
                    {" "}et la{" "}
                    <a href="/protection-des-donnees" className="text-orange-500 hover:text-orange-400 underline">
                      politique de confidentialité
                    </a>
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-8 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono font-bold uppercase tracking-widest rounded-lg transition-all"
                >
                  ← Précédent
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg"
                >
                  Suivant →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === "loading" || !formData.acceptedTerms}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-mono font-bold uppercase tracking-widest py-3 px-8 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                      Traitement...
                    </>
                  ) : (
                    "✓ Confirmer la réservation"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}