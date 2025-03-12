import './App.css'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

function App() {

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
    <div
    className='split left'>
       <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variants}
        transition={{ duration: 1 }}
         className='titlePos'>
      <h1 className='title'>
        Welcome to TemplateName
      </h1>      
      
      <h3 className='subtitle'>Control your expenses!</h3>
      <p className='description'>Manage all your expenses with just a click.</p>
        
      </motion.div>
    </div>

    <div className='split right'>
        <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variants}
        transition={{ duration: 3 }}
        className='loginPos'>
          <h1 className='subtitle'>Create an account!</h1>
          <p className='descriptionLogin'>It's free!</p>
          <Link to={"/login"}>
            <button className='buttonlogin'>Get Started!</button>
          </Link>
        </motion.div>
    </div>
      
    </>
  )
}

export default App
