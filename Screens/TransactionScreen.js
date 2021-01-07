import * as React from 'react';
import {View ,Text , StyleSheet,TouchableOpacity,TextInput,Image,KeyboardAvoidingView,ToastAndroid} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import db from "../config";
import firebase from "firebase";
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
    initiateBookIssue=async()=>{
        db.collection("Transactions").add({
            studentId:this.state.scannesStudentId,
            bookId:this.state.scannedBookId,
            date:firebase.firestore.Timestamp.now().toDate(),
            transactionType:"issue"
        })
        db.collection("Books").doc(this.state.scannedBookId).update({
            bookAvailable:false
        })
        db.collection("Students").doc(this.state.scannesStudentId).update({
            booksIssued:firebase.firestore.FieldValue.increment(1)
        })
    }

    initiateBookReturn=async()=>{
        db.collection("Transactions").add({
            studentId:this.state.scannesStudentId,
            bookId:this.state.scannedBookId,
            date:firebase.firestore.Timestamp.now().toDate(),
            transactionType:"returned"
        })
        db.collection("Books").doc(this.state.scannedBookId).update({
            bookAvailable:true
        })
        db.collection("Students").doc(this.state.scannesStudentId).update({
            booksIssued:firebase.firestore.FieldValue.increment(-1)
        })
    }
    handleTransaction=async()=>{
        var transactionMessage
        db.collection("Books").doc(this.state.scannedBookId).get()
        .then((doc)=>{
            var book=doc.data()
            if(book.bookAvailable){
                this.initiateBookIssue();
                transactionMessage="Book Issued";
                ToastAndroid.show(transactionMessage,ToastAndroid.SHORT);
            }else{
                this.initiateBookReturn();
                transactionMessage="Book Returned";
                ToastAndroid.show(transactionMessage,ToastAndroid.SHORT);
            }
            
        })
        this.setState({transactionMessage:transactionMessage});
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
            <KeyboardAvoidingView style={Styles.container} behavior="padding" enabled>
                <Image source={require("../assets/booklogo.jpg")} style={{
                    width:150,
                    height:150,
                }}/>
                <View style={Styles.cont}>
               <TextInput onChangeText={(text)=>{
                   this.setState({scannesStudentId:text})
               }} 
               style={Styles.inputBox}  
               value={this.state.scannesStudentId}
               placeholder="Student id"/>
               
               <TouchableOpacity    style={Styles.button} onPress={()=>{
                   this.getCameraPermission("studentId");
               }} ><Text>SCAN</Text></TouchableOpacity>
               </View>

               <View style={Styles.cont}>
               <TextInput  onChangeText={(text)=>{
                   this.setState({scannedBookId:text})
               }}
               value={this.state.scannedBookId}
               placeholder="Book id"  style={Styles.inputBox}/>
               
               <TouchableOpacity style={Styles.button} onPress={()=>{
                   this.getCameraPermission("bookId");
               }} ><Text>SCAN</Text></TouchableOpacity>
               </View>
               <TouchableOpacity onPress={this.handleTransaction}
               style={Styles.button}>
                   <Text>Submit</Text>
               </TouchableOpacity>
            </KeyboardAvoidingView>
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