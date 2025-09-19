"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Users, Mail, Phone, GraduationCap, User, FileText } from "lucide-react"
import Image from "next/image"

interface FormData {
  email: string
  telephone: string
  annee: string
  nom: string
  filiere: string
  motivation: string
}

export default function JLMClubForm() {
  const [showLanding, setShowLanding] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    telephone: "",
    annee: "",
    nom: "",
    filiere: "",
    motivation: "",
  })
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  const backgroundImages = [
    "/jlm-university-group.jpg", // Principal image - university group photo
    "/jlm-students-1.jpg",
    "/jlm-students-2.jpg",
    "/jlm-students-3.jpg",
    "/jlm-students-4.jpg",
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isFirstLoad) {
      const firstTimeout = setTimeout(() => {
        setCurrentBgIndex(1) // Move to second image
        setIsFirstLoad(false)
      }, 7000)

      return () => clearTimeout(firstTimeout)
    } else {
      interval = setInterval(() => {
        setCurrentBgIndex((prevIndex) => {
          if (prevIndex === backgroundImages.length - 1) {
            return 1 // Skip back to second image (not the principal one)
          }
          return prevIndex + 1
        })
      }, 4000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isFirstLoad, backgroundImages.length])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate required fields for step 1
      if (formData.email && formData.telephone && formData.annee && formData.nom && formData.filiere) {
        setCurrentStep(2)
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const handleSubmit = async () => {
    if (formData.motivation.trim()) {
      const googleFormUrl = "https://script.google.com/macros/s/AKfycbryt0WoVD_Ymz4OcjVxV9qc5DdrUKF-1QrN2og1zXtTKxpXyMy3FnUIvpck2zP6rv-HmCQ/exec";
      
      const dataToSend = new FormData();
      dataToSend.append("entry.865298508", formData.nom); // Nom complet
      dataToSend.append("entry.1259447430", formData.email); // Adresse email
      dataToSend.append("entry.2006055601", formData.telephone); // Numéro de téléphone
      dataToSend.append("entry.1290918550", formData.annee); // Année universitaire
      dataToSend.append("entry.542203514", formData.filiere); // Filière d'études
      dataToSend.append("entry.396193017", formData.motivation); // Motivation

      try {
        await fetch(googleFormUrl, {
          method: "POST",
          body: dataToSend,
          // Removed mode: "no-cors" as it's no longer needed with Apps Script
        });
        alert("Merci pour votre candidature ! Nous vous contacterons bientôt. Votre candidature a été enregistrée dans Google Forms.");
        console.log("Form submitted to Google Forms:", formData);
        // Optionally, reset the form after successful submission
        setFormData({
          email: "",
          telephone: "",
          annee: "",
          nom: "",
          filiere: "",
          motivation: "",
        });
        setCurrentStep(1); // Go back to the first step
        setShowLanding(true); // Go back to landing page
      } catch (error) {
        console.error("Error submitting form to Google Forms:", error);
        alert("Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer.");
      }
    }
  };

  const handleJoinUs = () => {
    setShowLanding(false)
  }

  const isStep1Valid = formData.email && formData.telephone && formData.annee && formData.nom && formData.filiere
  const isStep2Valid = formData.motivation.trim().length > 0

  const years = Array.from({ length: 2025 - 1970 + 1 }, (_, i) => 1970 + i)

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentBgIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`JLM Club Students ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {showLanding ? (
        // Landing Page
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            {/* Logo and Title */}
            <div className="mb-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Image src="/jlm-logo.png" alt="Logo JLM" fill className="object-contain" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">
                <span className="text-red-500">CLUB</span> <span className="text-green-500">JLM</span>{" "}
                <span className="text-yellow-500">ESTK</span>
              </h1>
              <p className="text-lg text-white/90 drop-shadow-lg mb-8">
                Exprimez votre résistance - Rejoignez notre communauté étudiante
              </p>
            </div>

            {/* Join Us Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleJoinUs}
                className="group relative px-12 py-6 text-xl font-bold bg-white/70 hover:bg-white/80 text-gray-900 backdrop-blur-sm border-2 border-white/50 hover:border-white/70 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 rounded-full"
                size="lg"
              >
                <span className="flex items-center gap-3">
                  Rejoignez-nous
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>

            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-4 h-4 bg-jlm-red rounded-full shadow-lg"></div>
              <div className="w-4 h-4 bg-jlm-yellow rounded-full shadow-lg"></div>
              <div className="w-4 h-4 bg-jlm-green rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      ) : (
        // Form Pages
        <>
          {/* Header */}
          <header className="relative z-10 border-b bg-card/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-center gap-4">
                <div className="relative w-16 h-16">
                  <Image src="/jlm-logo.png" alt="Logo JLM" fill className="object-contain" />
                </div>
                <div className="text-center">
                  <h1 className="text-xl font-bold text-foreground">
                    <span className="text-red-500">CLUB</span> <span className="text-green-500">JLM</span>{" "}
                    <span className="text-yellow-500">ESTK</span>
                  </h1>
                  <p className="text-muted-foreground text-sm">Rejoignez notre communauté étudiante</p>
                </div>
              </div>
            </div>
          </header>

          <main className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                    currentStep === 1
                      ? "bg-primary text-primary-foreground border-primary shadow-lg"
                      : "bg-card/80 backdrop-blur-sm border-border"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Informations</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                    currentStep === 2
                      ? "bg-primary text-primary-foreground border-primary shadow-lg"
                      : "bg-card/80 backdrop-blur-sm border-border"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Motivation</span>
                </div>
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <Card className="border-2 shadow-xl bg-card/60 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-jlm-red/20 to-jlm-yellow/20 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-jlm-red to-jlm-green bg-clip-text text-transparent">
                    Informations Personnelles
                  </CardTitle>
                  <CardDescription className="text-base">
                    Remplissez vos informations pour rejoindre le club JLM
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nom" className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nom complet *
                      </Label>
                      <Input
                        id="nom"
                        type="text"
                        placeholder="Votre nom complet"
                        value={formData.nom}
                        onChange={(e) => handleInputChange("nom", e.target.value)}
                        className="h-12 transition-all duration-200 focus:ring-2 focus:ring-jlm-red/50 hover:border-jlm-red/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Adresse email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre.email@universite.ma"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-12 transition-all duration-200 focus:ring-2 focus:ring-jlm-yellow/50 hover:border-jlm-yellow/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone" className="text-sm font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Numéro de téléphone *
                      </Label>
                      <Input
                        id="telephone"
                        type="tel"
                        placeholder="+212 6XX XXX XXX"
                        value={formData.telephone}
                        onChange={(e) => handleInputChange("telephone", e.target.value)}
                        className="h-12 transition-all duration-200 focus:ring-2 focus:ring-jlm-green/50 hover:border-jlm-green/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annee" className="text-sm font-medium flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Année universitaire *
                      </Label>
                      <Select value={formData.annee} onValueChange={(value) => handleInputChange("annee", value)}>
                        <SelectTrigger className="h-12 transition-all duration-200 hover:border-jlm-red/50">
                          <SelectValue placeholder="Sélectionnez votre année universitaire" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          <SelectItem value="premiere-annee">Première année</SelectItem>
                          <SelectItem value="deuxieme-annee">Deuxième année</SelectItem>
                          <SelectItem value="licence-professionnelle">Licence professionnelle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filiere" className="text-sm font-medium">
                        Filière d'études *
                      </Label>
                      <Select value={formData.filiere} onValueChange={(value) => handleInputChange("filiere", value)}>
                        <SelectTrigger className="h-12 transition-all duration-200 hover:border-jlm-yellow/50">
                          <SelectValue placeholder="Sélectionnez votre filière" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MGE">MGE</SelectItem>
                          <SelectItem value="ID">ID</SelectItem>
                          <SelectItem value="RCIA">RCIA</SelectItem>
                          <SelectItem value="GAA">GAA</SelectItem>
                          <SelectItem value="GPVA">GPVA</SelectItem>
                          <SelectItem value="GE">GE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleNextStep}
                      disabled={!isStep1Valid}
                      className="w-full h-12 text-base font-medium bg-gradient-to-r from-jlm-red to-jlm-yellow hover:from-jlm-red/90 hover:to-jlm-yellow/90 transition-colors duration-300 shadow-lg"
                      size="lg"
                    >
                      Continuer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Motivation */}
            {currentStep === 2 && (
              <Card className="border-2 shadow-xl bg-card/60 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-jlm-green/20 to-jlm-red/20 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-jlm-green to-jlm-red bg-clip-text text-transparent">
                    Lettre de Motivation
                  </CardTitle>
                  <CardDescription className="text-base">
                    Expliquez-nous pourquoi vous méritez de rejoindre notre équipe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="motivation" className="text-sm font-medium">
                      Pourquoi souhaitez-vous rejoindre le club JLM ? *
                    </Label>
                    <Textarea
                      id="motivation"
                      placeholder="Décrivez vos motivations, vos compétences, et ce que vous pouvez apporter au club JLM. Parlez de vos expériences, vos projets, et votre vision pour contribuer à notre communauté universitaire..."
                      value={formData.motivation}
                      onChange={(e) => handleInputChange("motivation", e.target.value)}
                      className="min-h-[200px] resize-none transition-all duration-200 focus:ring-2 focus:ring-jlm-green/50 hover:border-jlm-green/50"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 50 caractères ({formData.motivation.length}/50)
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-jlm-red/5 via-jlm-yellow/5 to-jlm-green/5 p-4 rounded-lg border border-jlm-red/20">
                    <h4 className="font-medium text-sm mb-2 text-jlm-red">Conseils pour votre motivation :</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Mentionnez vos expériences associatives ou de leadership</li>
                      <li>• Expliquez vos compétences et talents particuliers</li>
                      <li>• Décrivez votre vision pour le club</li>
                      <li>• Montrez votre engagement et votre disponibilité</li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex-1 h-12 text-base bg-transparent hover:bg-jlm-yellow/10 hover:border-jlm-yellow transition-colors duration-300"
                      size="lg"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStep2Valid || formData.motivation.length < 50}
                      className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-jlm-green to-jlm-red hover:from-jlm-green/90 hover:to-jlm-red/90 transition-colors duration-300 shadow-lg"
                      size="lg"
                    >
                      Envoyer ma candidature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Footer */}
            <footer className="text-center mt-12 py-6 border-t border-jlm-red/20 bg-card/40 backdrop-blur-sm rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-jlm-red rounded-full"></div>
                <div className="w-3 h-3 bg-jlm-yellow rounded-full"></div>
                <div className="w-3 h-3 bg-jlm-green rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground">Club JLM - Ensemble vers l'excellence</p>
            </footer>
          </main>
        </>
      )}
    </div>
  )
}
