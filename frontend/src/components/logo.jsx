import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector((store) => store.auth.user);
  const [roleColor, setRoleColor] = useState("#4CAF50");

  useEffect(() => {
    setRoleColor(user?.role === "recruiter" ? "#FF5722" : "#4CAF50");
  }, [user]);

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: i => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        y: { type: "spring", stiffness: 100 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const roleVariants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.5, ease: "circOut" } }
  };

  return (
    <motion.div
      className="relative inline-flex items-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = '/'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {"JobF".split('').map((letter, index) => (
          <motion.span
            key={index}
            className={`text-4xl font-extrabold ${index < 3 ? 'text-primary' : 'text-white'}`}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            style={index === 3 ? { 
              background: `linear-gradient(135deg, ${roleColor}, #2196F3)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              padding: '0 4px'
            } : {}}
          >
            {letter}
          </motion.span>
        ))}
        <AnimatePresence>
          {isHovered && user && (
            <motion.div
              className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-primary to-blue-500"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={roleVariants}
            />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isHovered && user && (
          <motion.span
            className="ml-2 text-sm font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            style={{ color: roleColor }}
          >
            {user.role === "recruiter" ? "Recruiter" : "Student"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Logo;