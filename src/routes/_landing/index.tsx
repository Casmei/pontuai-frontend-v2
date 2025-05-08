import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Award, Gift, Sparkles, Star, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useLogto } from "@logto/react"

export const Route = createFileRoute("/_landing/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [count, setCount] = useState(0)
  const { signIn } = useLogto()

  // Animação de contagem para estatísticas
  useEffect(() => {
    const interval = setInterval(() => {
      if (count < 1250) {
        setCount((prev) => prev + 25)
      } else {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [count])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-amber-50 overflow-hidden relative">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-300 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute top-1/2 -left-32 w-64 h-64 bg-amber-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-400 rounded-full opacity-10 blur-3xl"></div>

      <header className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 text-transparent bg-clip-text">
            Pontuaí
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            onClick={() => signIn("http://localhost:3000/callback")} // TODO: Usar env
            className="bg-amber-500 text-white px-6 py-3 rounded-md text-center hover:bg-amber-600 transition-colors inline-flex items-center justify-center"
          >
            Área do atendente
          </Button>
        </motion.div>
      </header>

      <main className="flex-1 flex items-center relative z-10">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Sistema de fidelização</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Fidelize clientes com{" "}
                <span className="bg-gradient-to-r from-amber-600 to-amber-400 text-transparent bg-clip-text">
                  pontos
                </span>{" "}
                que geram resultados
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Transforme clientes ocasionais em defensores da sua marca com um sistema de pontos
                intuitivo e eficaz para pequenas empresas.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-100 p-2 rounded-full mb-2">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold">{count.toLocaleString()}+</p>
                  <p className="text-xs text-gray-500">Clientes fidelizados</p>
                </div>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-100 p-2 rounded-full mb-2">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold">32%</p>
                  <p className="text-xs text-gray-500">Aumento em vendas</p>
                </div>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-100 p-2 rounded-full mb-2">
                    <Gift className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold">5.2K</p>
                  <p className="text-xs text-gray-500">Prêmios resgatados</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-300 flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="bg-white rounded-lg p-6 shadow-xl max-w-xs w-full relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold">Café Aroma</h3>
                      <p className="text-sm text-gray-500">Cliente: Maria Silva</p>
                    </div>
                    <motion.div
                      animate={{
                        rotate: [0, 10, 0, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <Star className="h-8 w-8 text-amber-500" />
                    </motion.div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pontos acumulados</span>
                        <span className="font-bold">235</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div
                          className="bg-gradient-to-r from-amber-500 to-amber-400 h-2.5 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>
                    <motion.div
                      className="bg-amber-50 p-4 rounded-lg border border-amber-100"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start gap-3">
                        <Award className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Próximo prêmio: 300 pontos</p>
                          <p className="text-xs text-gray-500">Café especial + sobremesa grátis</p>
                        </div>
                      </div>
                    </motion.div>
                    <div className="flex gap-2 flex-wrap">
                      <motion.div
                        className="bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs py-1.5 px-3 rounded-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        +15 pontos hoje
                      </motion.div>
                      <motion.div
                        className="bg-gray-100 text-gray-700 text-xs py-1.5 px-3 rounded-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        65 pontos para o próximo prêmio
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Cartão flutuante de histórico */}
                <motion.div
                  className="absolute -bottom-16 -right-20 bg-white rounded-lg p-4 shadow-lg w-48"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <h4 className="text-sm font-medium mb-2">Histórico recente</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Café Latte</span>
                      <span className="font-medium text-green-500">+5 pts</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Sanduíche</span>
                      <span className="font-medium text-green-500">+10 pts</span>
                    </div>
                  </div>
                </motion.div>

                {/* Notificação flutuante */}
                <motion.div
                  className="absolute -top-10 -left-16 bg-white rounded-full py-2 px-4 shadow-lg flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Cliente fidelizado!</span>
                </motion.div>
              </motion.div>

              {/* Elementos decorativos */}
              <div className="absolute top-10 right-10">
                <motion.div
                  className="w-12 h-12 rounded-full bg-amber-200 opacity-60"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.3, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                ></motion.div>
              </div>
              <div className="absolute bottom-20 left-20">
                <motion.div
                  className="w-8 h-8 rounded-full bg-amber-400 opacity-60"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0.3, 0.6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                ></motion.div>
              </div>
            </div>
          </motion.div>

          {/* Versão mobile da ilustração */}
          <motion.div
            className="md:hidden bg-gradient-to-br from-amber-100 to-amber-300 rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg p-5 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold">Café Aroma</h3>
                  <p className="text-sm text-gray-500">Cliente: Maria Silva</p>
                </div>
                <motion.div
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Star className="h-7 w-7 text-amber-500" />
                </motion.div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pontos acumulados</span>
                    <span className="font-bold">235</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "70%" }}
                      transition={{ duration: 1.5 }}
                    ></motion.div>
                  </div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Próximo prêmio: 300 pontos</p>
                      <p className="text-xs text-gray-500">Café especial + sobremesa grátis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-sm text-gray-500 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          © {new Date().getFullYear()} Pontuaí - Byalsoft. Todos os direitos reservados.
        </motion.div>
      </footer>
    </div>
  )
}
