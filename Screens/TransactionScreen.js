import * as React from 'react';
import {View ,Text , StyleSheet,TouchableOpacity,TextInput,Image} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';

export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            scannedBookId:"",
            scannesStudentId:"",
            buttonState:"normal",
        }
    }
     getCameraPermission=async(id)=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions:status==="granted",
            buttonState:id,
            scanned:false
        })
    }
    handleBarcodeScanner=async({type,data})=>{
        const {buttonState}=this.state
        if(buttonState==="bookId"){
        this.setState({
            scanned:true,
            scannedBookId:data,
            buttonState:"normal",

        })}else if(buttonState==="studentId"){
            this.setState({
                scanned:true,
                scannesStudentId:data,
                buttonState:"normal",
    
            })}
    }
    render(){
        const buttonState=this.state.buttonState
        if(buttonState!=="normal"&& this.state.hasCameraPermissions){
            return(
                <BarCodeScanner onBarCodeScanned={this.state.scanned===true?undefined:this.handleBarcodeScanner } 
                style={StyleSheet.absoluteFillObject}>
                </BarCodeScanner>
            )
        }
        else if(buttonState==="normal"){

        
        return(
            <View style={Styles.container}>
                <Image source={require("../assets/booklogo.jpg")} style={{
                    width:150,
                    height:150,
                }}/>
                <View style={Styles.cont}>
               <TextInput style={Styles.inputBox}  
               value={this.state.scannesStudentId}
               placeholder="Student id"/>
               
               <TouchableOpacity    style={Styles.button} onPress={()=>{
                   this.getCameraPermission("studentId");
               }} ><Text>SCAN</Text></TouchableOpacity>
               </View>

               <View style={Styles.cont}>
               <TextInput  
               value={this.state.scannedBookId}
               placeholder="Book id"  style={Styles.inputBox}/>
               
               <TouchableOpacity style={Styles.button} onPress={()=>{
                   this.getCameraPermission("bookId");
               }} ><Text>SCAN</Text></TouchableOpacity>
               </View>
            </View>
        );}
    }
}

var Styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    button:{
        width:100,
        height:50,
        backgroundColor:"grey",
        justifyContent:'center',
        alignItems:'center',
        marginLeft:40,
    },
    inputBox:{
        width:200,
        height:50,
        borderWidth:10,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
    },
    cont:{
        flexDirection:"row",
        margin:30,
    }

})