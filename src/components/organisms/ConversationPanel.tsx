"use client"

import { useState } from "react"
import { Mic, Square, EyeOff, Eye } from "lucide-react"
import IconButton from "@/components/atoms/IconButton"
import Image from "next/image"

interface ConversationPanelProps {
  onEndConversation?: () => void
}

export default function ConversationPanel({ onEndConversation }: ConversationPanelProps) {
  const [isTranscriptionVisible, setIsTranscriptionVisible] = useState(true)
  const [isMicActive, setIsMicActive] = useState(true)
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false)

  const handleStopConversation = () => {
    if (onEndConversation) {
      onEndConversation()
    }
  }

  const toggleMicrophone = () => {
    setIsMicActive(!isMicActive)
  }

  const toggleTranscription = () => {
    setIsTranscriptionVisible(!isTranscriptionVisible)
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Mostrar avatar hablando
      setIsAvatarSpeaking(true)
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-PE'
      
      // Cuando termina de hablar, volver al avatar quieto
      utterance.onend = () => {
        setIsAvatarSpeaking(false)
      }
      
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Conversación en directo</h2>

      <div className="flex h-96">
        {/* Visual area - 65% */}
        <div className="flex-1 bg-gray-100 rounded-l-lg p-6 flex flex-col items-center justify-center relative">
          {/* Main conversation visualization - Avatar container */}
          <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg relative overflow-hidden">
            {/* Avatar quieto */}
            <Image
              src="/avatar/0.gif"
              alt="Avatar quieto"
              width={200}
              height={200}
              className={`absolute inset-0 w-full h-full object-cover ${isAvatarSpeaking ? 'hidden' : 'block'}`}
            />
            {/* Avatar hablando */}
            <Image
              src="/avatar/avatar.gif"
              alt="Avatar hablando"
              width={200}
              height={200}
              className={`absolute inset-0 w-full h-full object-cover ${isAvatarSpeaking ? 'block' : 'hidden'}`}
              key={isAvatarSpeaking ? Date.now() : 0} // Reinicia la animación
            />
          </div>

          {/* Test button for avatar speech */}
          <button
            onClick={() => speakText("Hello! How can I help you today?")}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Prueba Avatar
          </button>

          {/* Control buttons */}
          <div className="flex justify-center space-x-6">
            {/* Microphone button - Blue circle */}
            <IconButton
              onClick={toggleMicrophone}
              className={`${isMicActive ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-500"} hover:shadow-xl`}
              size="lg"
            >
              <Mic className="w-6 h-6" />
            </IconButton>

            {/* Stop button - Red square */}
            <button
              onClick={handleStopConversation}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Detener conversación"
            >
              <Square className="w-6 h-6 mx-auto" fill="currentColor" />
            </button>

            {/* Hide transcription button - Yellow circle */}
            <IconButton
              onClick={toggleTranscription}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800 hover:shadow-xl"
              size="lg"
            >
              {isTranscriptionVisible ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </IconButton>
          </div>
        </div>

        {/* Chat transcript - 35% */}
        {isTranscriptionVisible && (
          <div className="w-2/5 bg-yellow-50 rounded-r-lg p-4 border-l">
            <div className="h-full flex flex-col">
              <h3 className="font-semibold text-gray-800 mb-4">Transcripción</h3>
              <div className="flex-1 space-y-3 overflow-y-auto">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Emily: Hello! How can I help you today?</span>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-sm text-gray-700">You: Hi, I'd like to practice ordering food.</span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Emily: Great! What would you like to order?</span>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-sm text-gray-700">You: I'll have a burger and fries, please.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}