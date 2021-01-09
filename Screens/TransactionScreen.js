import * as React from 'react';
import {View ,Text , StyleSheet,TouchableOpacity,TextInput,Image,KeyboardAvoidingView,ToastAndroid, Alert} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import db from "../config";
import firebase from "firebase";
import { TabRouter } from 'react-navigation';
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

    checkStudentElibilityForBookIssue=async()=>{
        const studentRef=await db.collection("Students").where("studentId","==",this.state.scannesStudentId).get();
        var isStudentElible=""
        if(studentRef.docs.length===0){
            this.setState({
                scannedBookId:"",
                scannesStudentId:"",
            })
            isStudentElible=false;
            Alert.alert("Student id does not exist");
    }else{
        studentRef.docs.map((doc)=>{
            var student=doc.data();
            if(student.booksIssued<2){
                isStudentElible=true
            }else{
                isStudentElible=false
                Alert.alert("TWO BOOKS ALREADY ISSUED")
                this.setState({
                    scannedBookId:"",
                    scannesStudentId:"",
                })
            }
        })
    }
    return isStudentElible;
}

checkStudentElibilityForBookReturn=async()=>{
    const transactionRef=await db.collection("Transactions").where("bookId","==",this.state.scannedBookId).limit(1).get();
    var isStudentElible=""
    
    transactionRef.docs.map((doc)=>{
        var lastBookT=doc.data();
        if(lastBookT.studentId==this.state.scannesStudentId){
            isStudentElible=true
        }else{
            isStudentElible=false
            Alert.alert("BOOK NOT ISSUED BY THIS STUDENT")
            this.setState({
                scannedBookId:"",
                scannesStudentId:"",
            })
        }
    })
    return isStudentElible;
}

checkBookEligibility=async()=>{
    const bookRef=await db.collection("Books").where("bookId","==",this.state.scannedBookId).get();
    var transactionType=""
    if(bookRef.docs.length==0){
        transactionType=false
    }else{
        bookRef.docs.map((doc)=>{
            var book =doc.data()
            if(book.bookAvailable){
                transactionType="issue"
            }else{
                transactionType="return"
            }
        })
    }
    return transactionType;
}


    handleTransaction=async()=>{
        var transactionType=await this.checkBookEligibility()
        if(!transactionType){
            Alert.alert("This book does not exist in the library")
            this.setState({
                scannesStudentId:"",
                scannedBookId:"",
            })
        }else if(transactionType==="issue"){
            var isStudentElible=await this.checkStudentElibilityForBookIssue();
            if(isStudentElible){
                this.initiateBookIssue();
                Alert.alert("Book issued to the student")
            }
        }else{
            var isStudentElible=await this.checkStudentElibilityForBookReturn();
            if(isStudentElible){
                this.initiateBookReturn();
                Alert.alert("Book returned to the student")
            }  
        }
        
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