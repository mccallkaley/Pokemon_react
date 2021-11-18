import React, { Component } from 'react'
import * as Yup from 'yup';
import {Formik, Field, Form} from 'formik';
import Table from 'react-bootstrap/Table'

const formSchema = Yup.object().shape({
    "name": Yup.string().required("Required"),

})

const initialValues = {
    name:''
}

export default class Home extends Component {

    constructor() {
        super();
        this.state={
            pokemon: [],
            badName: false
        };
    }

    removeDuplicates=(inputArr)=>{
        let unique = [...new Set(inputArr)];
        return unique; 
    }

    handleSubmit=({name})=>{
        let newArr = this.state.pokemon;
        newArr = this.removeDuplicates(newArr);
        this.setState({
            pokemon: newArr,
            badName: false
        }, ()=>console.log(this.state.pokemon))

        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(res=>res.json())
        .then(data=>{
            this.setState({
                pokemon: [data],
                badName: false
            }, ()=>console.log(this.state.pokemon))
        })
        .catch(error=>{console.error(error); this.setState({badName:true})})

    }    

    render() {
        return (
            <div>
                <h1>Search for Pokemon!</h1>
                {this.state.badName ? <small style={{color:"red"}}>Pokemon does not exist!!</small>:""}
                <Formik initialValues={initialValues}
                        validationSchema={formSchema}
                        onSubmit={
                            (values, {resetForm})=>{
                                this.handleSubmit(values);
                                resetForm(initialValues);
                            }
                        }
                        >
                        {
                            ({errors, touched})=>(
                                <Form>
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <Field name="name" className="form-control" />
                                    {errors.name && touched.name ? (<div style={{color:'red'}}>{errors.name}</div>):null}

                                    <button type="submit" className="btn btn-primary">Search</button>

                                </Form>
                            )
                        }

                </Formik>

                {/* POKE TABLE */}
                {this.state.pokemon?.length > 0 ? 
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Base XP</th>
                        <th>Defense</th>
                        <th>Attack</th>
                        <th>Sprite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.pokemon.map(
                            pokemon => (
                                <tr key={pokemon.id}>
                                <th>{pokemon.name}</th>
                                <td>{pokemon.base_experience}</td>
                                <td>{pokemon.stats[2].base_stat}</td>
                                <td>{pokemon.stats[1].base_stat}</td>
                                <td><img src={pokemon.sprites.front_shiny} alt="pokemon-sprite" /></td>
                                </tr>
                            )
                        )}

                    </tbody>
                </Table>
                :""}

            </div>
        )
    }
}