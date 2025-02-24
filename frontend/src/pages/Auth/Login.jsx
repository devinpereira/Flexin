import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaEye, FaEyeSlash, FaGoogle, FaApple } from 'react-icons/fa';
import backgroundImage from '../../assets/fitness-bg.png';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Min 8 characters').required('Required'),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
    },
  },
};

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: () => {
      // Handle login
    },
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="h-screen w-screen flex overflow-hidden">
        {/* Left Side Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hidden md:block w-1/2 h-full bg-cover bg-center mr-[-30px]"
          style={{
            backgroundImage: "url('/assets/fitness-side-image.png')",
            clipPath: 'polygon(0 0, 100% 0, calc(100% - 50px) 100%, 0 100%)',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="h-full bg-gradient-to-r from-gray-900/60 to-transparent flex items-center p-12"
          >
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: 0.8,
              }}
              className="text-6xl font-bold text-orange-500 drop-shadow-lg"
            >
              GYMFITO
            </motion.h1>
          </motion.div>
        </motion.div>

        {/* Right Side Login Form */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 20,
              mass: 0.5,
            }}
            className="w-full md:w-1/2 h-full flex items-center justify-center pl-8 pr-12"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative w-full max-w-[619px] h-full max-h-[600px] flex flex-col justify-center"
              style={{
                clipPath: 'polygon(100px 0, 100% 0, 100% calc(100% - 100px), calc(100% - 100px) 100%, 0 100%, 0 100px)',
              }}
            >
              {/* Gradient Border Animation */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-orange-500 to-orange-600"
                style={{
                  clipPath: 'polygon(100px 0, 100% 0, 100% calc(100% - 100px), calc(100% - 100px) 100%, 0 100%, 0 100px)',
                }}
              >
                <motion.div
                  className="h-full w-full rounded-2xl bg-gray-900/95 backdrop-blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              </motion.div>

              {/* Login Content */}
              <div className="relative p-8 space-y-6">
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl font-bold text-orange-500 text-center"
                >
                  Sign In
                </motion.h1>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <motion.div variants={containerVariants} className="space-y-6">
                    {/* Email Input */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Email or Phone Number
                      </label>
                      <motion.input
                        whileFocus={{
                          scale: 1.02,
                          boxShadow: '0px 4px 20px rgba(249, 115, 22, 0.15)',
                        }}
                        name="email"
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                      />
                    </motion.div>

                    {/* Password Input */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Password
                      </label>
                      <div className="relative">
                        <motion.input
                          whileFocus={{
                            scale: 1.02,
                            boxShadow: '0px 4px 20px rgba(249, 115, 22, 0.15)',
                          }}
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-orange-500 hover:text-orange-400 transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Sign In Button */}
                    <motion.div variants={itemVariants}>
                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          boxShadow: '0px 8px 25px rgba(249, 115, 22, 0.3)',
                        }}
                        whileTap={{
                          scale: 0.98,
                          boxShadow: '0px 4px 15px rgba(249, 115, 22, 0.2)',
                        }}
                        type="submit"
                        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all"
                      >
                        Sign In
                      </motion.button>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                      variants={itemVariants}
                      className="relative py-6"
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute inset-0 flex items-center"
                      >
                        <div className="w-full border-t border-gray-700"></div>
                      </motion.div>
                      <div className="relative flex justify-center">
                        <span className="px-4 bg-gray-900/95 text-sm text-gray-400">
                          or continue with
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Stacked Social Buttons */}
                  <motion.div
                    variants={containerVariants}
                    className="flex flex-col space-y-4"
                  >
                    {[
                      { icon: <FaGoogle />, text: 'Continue with Google' },
                      { icon: <FaApple />, text: 'Continue with Apple' },
                    ].map((btn) => (
                      <motion.button
                        key={btn.text}
                        variants={itemVariants}
                        whileHover={{
                          y: -2,
                          scale: 1.02,
                          backgroundColor: 'rgba(31, 41, 55, 0.5)',
                        }}
                        className="w-full flex items-center justify-center gap-3 py-3.5 px-5 bg-gray-800 rounded-xl transition-all"
                      >
                        <span className="text-orange-500 text-xl">{btn.icon}</span>
                        <span className="text-base">{btn.text}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Login;