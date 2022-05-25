import React, {useState, useCallback, useEffect} from "react";
import {Container, Form, SubmitButton,List, DeleteButton} from './styles'
import api from '../../services/api'
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Link } from "react-router-dom";
export default function Main(){

    const [newRepo, setNewRepo] = useState('')
    const [repositorios, setRepositorios] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)


    //DidMount - Buscar
    useEffect(()=>{
        const repoStorage = localStorage.getItem('repos')
        setRepositorios(JSON.parse(repoStorage))
        
    },[])

    //DidUpdate - Salvar Alteracoes
    useEffect(()=>{
        localStorage.setItem('repos', JSON.stringify(repositorios))
    },[repositorios])


    const handleSubmit = useCallback((e)=> {

        e.preventDefault();

        async function submit(){
         
        setLoading(true)
        setAlert(null)    

        try{

            if(newRepo == ''){
                throw new Error('Indique um repositorio!')
            }

            const response = await api.get(`repos/${newRepo}`)

            const hasRepo = repositorios.find(repo => repo.name == newRepo)

            if(hasRepo){
                throw new Error('Repositorio ja existente!')
            }

            const data = {
                name: response.data.full_name,
            }
            setRepositorios([...repositorios, data])
            setNewRepo('')
        }catch(error){
            setAlert(true)
            console.log(error)
        }finally{
            setLoading(false)
        }    
        
        }
        submit()
    }, [newRepo,repositorios])
       
    

    function handleinputChange(e){
        setNewRepo(e.target.value)
        setAlert(null)
    }

    const handleDelete = useCallback((repo)=>{
        const find = repositorios.filter(r=> r.name != repo)
        setRepositorios(find);
    },[repositorios])

    return(
        <Container>
            <h1>
                <FaGithub size={25}/>
                Meus Repositorios
            </h1>

            <Form onSubmit={handleSubmit} error = {alert} >
                <input 
                type="text"
                placeholder="Adicionar Repositorios"
                value={newRepo}
                onChange={handleinputChange} />

                <SubmitButton loading={loading ? 1 : 0} >
                    {loading ? (
                        <FaSpinner color="#fff" size={14}/>
                    ) : (
                        <FaPlus size={14} color="#FFF" />
                    )}
                    
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick= {()=> handleDelete(repo.name)}>
                                <FaTrash size={14}/>
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`} >
                            <FaBars size={20}/>°
                        </Link>
                    </li>
                ))}        
            </List>

        </Container>
    )
}