import * as React from 'react';
import {View ,Text , StyleSheet,FlatList} from 'react-native';
import db from "../config";
import firebase from 'firebase';

export default class SearchScreen extends React.Component{
    constructor(){
        super();
        this.state={
            allTransactions:[],
            lastVisibleTransaction:"",
        }
    }
    componentDidMount=async()=>{
        const query=await db.collection("Transactions").get()
        query.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()]
            })
        })
    }
    fetchMoreTransactions=async()=>{
        const query=await db.collection("Transactions").startAfter(this.state.lastVisibleTransaction).limit(10).get()
        query.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastVisibleTransaction:doc
            })
            })
    }
    render(){
        return(
            <View style={Styles.container}>
                <Text>Search Screen</Text>
                <FlatList
                    data={this.state.allTransactions}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={({item})=>(
                        <View>
                            <Text>{"Book id: " +item.bookId}</Text>
                            <Text>{"Student id: " +item.studentId}</Text>
                            <Text>{"Transaction Type : " +item.transactionType}</Text>
                            <Text>{"Date : " +item.date.toDate()}</Text>
                        </View>
                    )}
                    onEndReached={this.fetchMoreTransactions}
                    onEndReachedThreshold={0.7}
                />
            </View>
        );
    }
}

var Styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    }
})