import { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import "../style/Login.css"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";

const LoginFront = () =>{
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [reg, setReg] = useState(true);

    const variants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
      };

    async function login(event: React.FormEvent, email:string, password:string) {
        event.preventDefault();

        try {
            const response = await api.post("/users/login", {
                email,
                password
            });
    
            const token = response.data.token;
            localStorage.setItem("token", token); 

            console.log("Login realizado com sucesso!");
            navigate("/dashboard");
        } catch (error) {
            const err = error as AxiosError
            
            console.error("Erro ao fazer login:", err.response?.data || err.message);
        }
    }
    
    async function register(event: React.FormEvent, name:string, email:string, password:string, confirmPassword:string) {
        try {
            event.preventDefault();
            if(password !== confirmPassword) {
                console.error("Passwords don't match");
                return;
            }
            if(password.length < 6) {
                console.error("Password should have at least 6 characters");
                return;
            }
            const response = await api.post("/users", {
                name,
                email,
                password
            });
    
            const token = response.data.token;
            localStorage.setItem("token", token); 
    
            console.log("Cadastro realizado com sucesso!");
            navigate("/dashboard");

        } catch (error) {
            const err = error as AxiosError

            console.error("Erro ao fazer cadastro:", err.response?.data || err.message);
        }
    }

    const toggleReg = () => {
        setReg(!reg);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      };
      
    
    return(
        <>
        <div className="container">
        
        {reg ? (
                <motion.form
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={variants}
                transition={{ duration: 0.5 }}
                className="formsReg" onSubmit={(e) => register(e ,name, email, password, confirmPassword)}>
                    <h1>Register</h1>
                    
                    <label htmlFor="name">Name</label>
                    <input id="name" required type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />

                    <label htmlFor="email">Email</label>
                    <input id="email" required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />

                    <label htmlFor="password">Password</label>
                     <div className="password-container">
                        <input
                            required
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </span>
                    </div>
                    <input type="password" required id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    <span>
                        {password && password.length < 6 && "Password should have at least 6 characters"}
                    </span>
                    <span>
                        {confirmPassword && confirmPassword !== password && "Passwords don't match"}
                    </span>

                    <div className="button">
                        <button>Sign Up</button>
                    </div>

                    <div className="link">
                        <a onClick={toggleReg}>Already have an account? Sign In</a>
                    </div>
                </motion.form>
            ) :(
            <>    
                <motion.form
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={variants}
                transition={{ duration: 0.5 }} 
                className="formsReg" onSubmit={(e) => login(e,email, password)}>
                <h1>Login</h1>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    
                    <label  htmlFor="password">Email</label>
                    <div className="password-container">
                        <input
                            required
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </span>
                    </div>                    
                    <div className="button">
                        <button >Login</button>        
                    </div>
                    <div className="link">
                        <a onClick={toggleReg}>Don't have a account? Sign Up</a>
                    </div>
                </motion.form>
            </>
        )}
            </div>
        </>
    )
}

export default LoginFront