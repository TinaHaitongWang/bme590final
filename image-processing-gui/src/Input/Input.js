import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Loader from './../UI/Loader';
import {Redirect} from 'react-router-dom';
import Welcome from './Stateless/Welcome';
import Instructions from './Stateless/Instructions';
import SelectImages from './Stateless/SelectImages';
import Options from './Stateless/Options';
import Instruction2 from './Stateless/Instruction2';

class Input extends Component {
    state = {
        loading:false,
        fileNames:[],
        jsonData:{
            "files":[],
            "HE":true,
            "CS":false,
            "LC":false,
            "RV":false,
            "uuid":this.props.uuid,
        }
    }
    
    optionToggle=(option)=>{
        this.setState(prevState=>{
            return{
                jsonData:{
                    ...prevState.jsonData,
                    [option]:!prevState.jsonData[option]
                }
            }
        })
    }

    fileUpdate = (event) => {
        let files = event.target.files;
        console.log(files);
        this.setState(prevState=>{
            return{
                fileNames:[],
                jsonData:{
                    ...prevState.jsonData,
                    "files":[]
                }
            }
        },()=>{
            for (let file of files) {
                this.setState(prevState => (
                    {
                        fileNames: [...prevState.fileNames, file["name"]]
                    }
                ));
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    this.setState(prevState => {
                        return {
                            jsonData: {
                                ...prevState.jsonData,
                                "files": [
                                    ...prevState.jsonData["files"],
                                    reader.result
                                ]
                            }
                        }
                    })
                }
            }
        })
    }

    submitButton=()=>{
        // if (this.props.sentStatus===true){
        //     let newData = {
        //         "uuid": this.props.uuid,
        //         "HE": this.state.jsonData.HE,
        //         "CS": this.state.jsonData.CS,
        //         "LC": this.state.jsonData.LC,
        //         "RV": this.state.jsonData.RV,
        //     }
        //     this.setState({
        //         loading: true},
        //     ()=>console.log(newData))
        // }
        // else{
        //     this.setState({ loading: true, sent: true }, () => {
        //         console.log(this.state);
        //         this.props.keepFilenames(this.state.fileNames);
        //     })
        // }
        if (this.props.sentStatus===true){
            this.setState({ loading: true });
            let newData = {
                "uuid": this.props.uuid,
                "HE": this.state.jsonData.HE,
                "CS": this.state.jsonData.CS,
                "LC": this.state.jsonData.LC,
                "RV": this.state.jsonData.RV,
            }
            axios.post('http://127.0.0.1:5000/new_data', newData, {
                onUploadProgress: progressEvent => {
                    let progressPercent = (progressEvent.loaded / progressEvent.total);
                    console.log(progressPercent);
                }
            }).then(response => {
                this.setState({ loading: false }, () => {
                    console.log(newData, response);
                    this.props.keepFilenames(this.state.fileNames);
                });
            }).catch(err => {
                this.setState({ loading: false });
                alert("Something went wrong, please try again. Error: " + err);
            })
        }
        else{
            this.setState({ loading: true });
            axios.post('http://127.0.0.1:5000/new_user', this.state.jsonData, {
                onUploadProgress: progressEvent => {
                    let progressPercent = (progressEvent.loaded / progressEvent.total);
                    console.log(progressPercent);
                }
            }).then(response => {
                this.setState({ loading: false },()=>{
                    console.log(this.state.jsonData, response);
                    this.props.keepFilenames(this.state.fileNames);
                });
            }).catch(err => {
                this.setState({ loading: false });
                alert("Something went wrong, please try again. Error: " + err);
            })
        }
    }


    render() {
        let disable = false;
        if (this.state.jsonData["files"].length===0 && this.props.sentStatus===false){
            disable=true;
        }

        let content = (
            <Fragment>
                <Welcome />
                <Instructions />
                {this.props.sentStatus ? <Instruction2 names={this.props.fileNames} /> 
                : <SelectImages
                    updateFile={this.fileUpdate} />}
                <Options 

                    toggle={this.optionToggle}
                    optionData={this.state.jsonData} />
                {this.state.loading ? <Loader /> : <button disabled={disable} onClick={this.submitButton}>Submit</button>}
            </Fragment>
        );
        
        // if (this.props.redirect===true){
        //     content=<Redirect to="/results" />
        // }
        // else{
        //     content = (
        //         <Fragment>
        //             <Welcome />
        //             <Instructions />
        //             {this.props.sentStatus ? <Instruction2 names={this.props.fileNames} />
        //                 : <SelectImages
        //                     updateFile={this.fileUpdate} />}
        //             <Options
        //                 toggle={this.optionToggle}
        //                 optionData={this.state.jsonData} />
        //             {this.state.loading ? <Line style={{ height: '20px' }} percent={this.state.percentage} strokeWidth="6" strokeColor="black" /> : <button disabled={disable} onClick={this.submitButton}>Submit</button>}
        //         </Fragment>
        //     )
        // }

        return (
            <div>
                {content}
            </div>
        );
    }
}

export default Input;