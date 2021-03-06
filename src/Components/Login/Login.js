import Logo from "../Share/logo.png"
import { useState, useContext } from "react";
import { useHistory } from "react-router";
import { Button, Form, Input, LogoImg } from "../Share/Style";
import { getLogin } from "../Service/Api";
import { UserContext } from "../Context/UserContext";
import Loader from 'react-loader-spinner';

export default function Login() {

    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {user, setUser} = useContext(UserContext);
    
    function loadLogin() {

        const data = localStorage.getItem("userInfo");
        if(data) {
            setUser(JSON.parse(data));
            history.push("/hoje");
        }
    }
    
    function Acess(event) {
        
        event.preventDefault();
        if(validateEmail(email)){
            setLoading(true);
            const body = {
                email: email,
                password: password
            }

            getLogin(body).then((resp) => {
                setUser(resp.data);
                const data = JSON.stringify(resp.data);
                localStorage.setItem("userInfo", data);
                history.push("/hoje");
            }).catch((resp) => {
                alert("Dados inválidos");
                setLoading(false);
            });
        }else{
            alert("Insira um email válido!")
        }
    }
    loadLogin();

    return (
        <Form onSubmit={Acess}>
            <LogoImg src={Logo} alt="Logo"/>
            <Input 
                type="email" value={email} placeholder="email" 
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading} required
            />
            <Input 
                type="password" value={password} placeholder="senha" 
                onChange={(e) => setPassword(e.target.value)} required 
                disabled={loading}
            />
            <Button type="submit" disabled={loading} opacity={loading ? 0.7 : 1}>
                {!loading ? "Entrar" : <Loader type="ThreeDots" color="#FFFFFF" height={13} width={80} />}
            </Button>
            <p onClick={ () => history.push("/cadastro")}>Não tem uma conta? Cadastre-se!</p>
        </Form >
    );
}

function validateEmail(email) {
    let reg = /\S+@\S+\.\S+/;
    return reg.test(email);
}
