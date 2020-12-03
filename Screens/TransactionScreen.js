import * as React from 'react';
import {View ,Text , StyleSheet,TouchableOpacity} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';

export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            scannedData:"",
            buttonState:"normal",
        }
    }
     getCameraPermission=async()=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions:status==="granted",
            buttonState:"clicked"
        })
    }
    handleBarcodeScanner=async({type,data})=>{
        this.setState({
            scanned:true,
            scannedData:data,
            buttonState:"normal",

        })
    }
    render(){
        const buttonState=this.state.buttonState
        if(buttonState==="clicked"&& hasCameraPermissions){
            return(
                <BarCodeScanner onBarCodeScanned={this.state.scanned===true?undefined:this.handleBarcodeScanner } 
                style={StyleSheet.absoluteFillObject}>
                </BarCodeScanner>
            )
        }
        else if(buttonState==="normal"){

        
        return(
            <View style={Styles.container}>
                <Text>Transaction Screen</Text>
                <Text>{this.state.hasCameraPermissions===true?this.state.scannedData:"Request Camera Permission"}</Text>
                <TouchableOpacity>
                <Text> Scan QR-CODE</Text> 
                </TouchableOpacity>
            </View>
        );}
    }
}

var Styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    }
})