'use client'

import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import axios from "axios"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Loader2, Building2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { COMPANY_API_END_POINT } from "@/utils/constant"
import { setSingleCompany } from "@/redux/companySlice"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import * as THREE from "three"
import Navbar from "../shared/Navbar"

function RecruitingIllustration() {
  const groupRef = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t / 2) * 0.1
    groupRef.current.position.y = Math.sin(t / 2) * 0.1
    materialRef.current.color.setHSL(t * 0.1 % 1, 0.5, 0.5)
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial ref={materialRef} />
      </mesh>
      <mesh position={[1.2, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
      <mesh position={[-1.2, 0, 0]}>
        <coneGeometry args={[0.5, 1, 32]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  )
}

export default function CompanyCreate() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [companyName, setCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name cannot be empty")
      return
    }

    setIsLoading(true)
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company))
        toast.success(res.data.message)
        const companyId = res?.data?.company?._id
        navigate(`/admin/companies/${companyId}`)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to create company. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      {/* <Navbar /> */}
      <div className="flex-grow flex flex-col lg:flex-row items-center justify-center p-4 gap-8">
        <div className="w-full lg:w-1/2 h-[300px] lg:h-[600px] max-w-2xl">
          <Canvas>
            <OrbitControls enableZoom={false} />
            <RecruitingIllustration />
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
          </Canvas>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 max-w-md"
        >
          <Card className="border-none shadow-lg bg-card backdrop-blur-sm bg-opacity-80">
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Building2 className="w-10 h-10 text-primary" />
                </motion.div>
                <CardTitle className="text-2xl font-bold tracking-tight">Create Your Company</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Enter your company name to get started. You can update this later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                onClick={registerNewCompany}
                disabled={isLoading}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Company'
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}