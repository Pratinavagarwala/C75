import  * as React from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity,TextInput, ToastAndroid } from 'react-native';
import db from "../config";
import firebase from 'firebase';

export default class LoginScreen extends React.Component{
    constructor(){
        super();
        this.state={
            emailId:"",
            password:""
        }
    }

    login=async(email,password)=>{
        if(email && password){
            try{
                const response=await firebase.auth().signInWithEmailAndPassword(email,password)
                if(response){
                    this.props.navigation.navigate("Transaction")
                }
            }
            catch(error){
                ToastAndroid.show(error.message,ToastAndroid.LONG)
            }
        }
    }
    
    render(){
        return(
            <View>
                <Text>Willy App</Text>
                <TextInput 
                style={styles.input}
                placeholder="Email address"
                keyboardType={"email-address"}
                onChangeText={(emailId)=>{
                    this.setState({
                        emailId:emailId
                    })    
                }}
                value={this.state.emailId}
                />

                <TextInput 
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(password)=>{
                    this.setState({
                        password:password
                    })    
                }}
                value={this.state.password}
                />

                <TouchableOpacity 
                style={styles.button}
                onPress={()=>{
                    this.login(this.state.emailId,this.state.password)
                }}
                >
                <Text> LOGIN </Text>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles=StyleSheet.create({
    input:{
        borderWidth:1,
        textAlign:"center",
        justifyContent:"center"
    },
    button:{
        marginTop:30,
        marginBottom:30,
        borderWidth:5,
        borderRadius:5,
    }
})