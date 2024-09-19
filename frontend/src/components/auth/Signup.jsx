import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Loader2, User2Icon, Mail, MapPin, Phone, Lock, Upload, CheckCircle2 } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Text } from "@react-three/drei";
import * as THREE from "three";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Navbar from "../shared/Navbar";
import { USER_API_END_POINT } from "@/utils/constant";
import { setLoading } from "@/redux/authSlice";

const AnimatedSpheres = () => {
  const group = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={group}>
      {[...Array(5)].map((_, index) => (
        <mesh key={index} position={[Math.sin(index * 1.2) * 2, Math.cos(index * 1.2) * 2, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={`hsl(${index * 50}, 100%, 75%)`} />
        </mesh>
      ))}
    </group>
  );
};

const AnimatedText = () => {
  const textRef = useRef();

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Text
      ref={textRef}
      fontSize={0.5}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      Join Us
    </Text>
  );
};

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    location: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });
  const [preview, setPreview] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("personal");
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const updateFormProgress = useCallback(() => {
    const totalFields = Object.keys(input).length;
    const filledFields = Object.values(input).filter(Boolean).length;
    setFormProgress((filledFields / totalFields) * 100);
  }, [input]);

  useEffect(() => {
    updateFormProgress();
  }, [input, updateFormProgress]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput(prev => ({ ...prev, file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(input).forEach(key => {
      if (key !== 'file') {
        formData.append(key, input[key]);
      }
    });
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const inputFields = [
    { name: "fullname", label: "Full Name", type: "text", icon: User2Icon, tab: "personal" },
    { name: "email", label: "Email", type: "email", icon: Mail, tab: "personal" },
    { name: "location", label: "Location", type: "text", icon: MapPin, tab: "personal" },
    { name: "phoneNumber", label: "Phone Number", type: "tel", icon: Phone, tab: "contact" },
    { name: "password", label: "Password", type: "password", icon: Lock, tab: "security" },
  ];

  const renderInputField = ({ name, label, type, icon: Icon }) => (
    <div key={name} className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type={name === "password" ? (showPassword ? "text" : "password") : type}
          id={name}
          name={name}
          value={input[name]}
          onChange={changeEventHandler}
          placeholder={`Enter your ${label.toLowerCase()}`}
          className="pl-10 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          required
        />
        {name === "password" && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardHeader className="p-0">
                  <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
                  <CardDescription className="text-lg mt-2 text-blue-100">
                    Join our community and unlock new opportunities
                  </CardDescription>
                </CardHeader>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="text-green-300" />
                    <span>Access to exclusive job listings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="text-green-300" />
                    <span>Connect with industry professionals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="text-green-300" />
                    <span>Personalized career guidance</span>
                  </div>
                </div>
                <div className="mt-8 h-64">
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <OrbitControls enableZoom={false} enablePan={false} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <AnimatedSpheres />
                    <AnimatedText />
                    <Environment preset="sunset" />
                  </Canvas>
                </div>
              </div>
              <div className="md:w-1/2">
                <form onSubmit={submitHandler} className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    <TabsContent value="personal" className="mt-4 space-y-4">
                      {inputFields.filter(field => field.tab === "personal").map(renderInputField)}
                    </TabsContent>
                    <TabsContent value="contact" className="mt-4 space-y-4">
                      {inputFields.filter(field => field.tab === "contact").map(renderInputField)}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</Label>
                        <RadioGroup
                          name="role"
                          value={input.role}
                          onValueChange={(value) => setInput(prev => ({ ...prev, role: value }))}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="student" id="student" />
                            <Label htmlFor="student">Student</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="recruiter" id="recruiter" />
                            <Label htmlFor="recruiter">Recruiter</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </TabsContent>
                    <TabsContent value="security" className="mt-4 space-y-4">
                      {inputFields.filter(field => field.tab === "security").map(renderInputField)}
                      <div className="space-y-2">
                        <Label htmlFor="profile-pic" className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</Label>
                        <div className="flex items-center space-x-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="w-16 h-16 rounded-full"
                                  onClick={() => document.getElementById('profile-pic').click()}
                                >
                                  {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                                  ) : (
                                    <Upload className="w-6 h-6" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Upload profile picture</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {input.file ? input.file.name : "No file chosen"}
                          </span>
                        </div>
                        <Input
                          id="profile-pic"
                          type="file"
                          accept="image/*"
                          onChange={changeFileHandler}
                          className="hidden"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Form Progress</Label>
                      <Progress value={formProgress} className="w-full" />
                    </div>
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <Button 
                          type="submit" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                          disabled={loading || formProgress < 100}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing Up...
                            </>
                          ) : (
                            "Sign Up"
                          )}
                        </Button>
                      </motion.div>
                    </AnimatePresence>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                      Already have an account?{" "}
                      <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                        Log in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;