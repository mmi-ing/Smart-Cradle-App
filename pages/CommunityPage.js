import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';

const main = require('../assets/main.png');
import data from '../data.json';
import Card from '../components/Card';
export default function CommunityPage(navigation){

  const [state,setState] = useState([])
  const [cateState,setCateState] = useState([])

  useEffect(()=>{
		//뒤의 1000 숫자는 1초를 뜻함
    //1초 뒤에 실행되는 코드들이 담겨 있는 함수
    setTimeout(()=>{
        //헤더의 타이틀 변경
        
        setState(data.tip)
        setCateState(data.tip)
    },1000)
 
    
  },[])

  return (
    <ScrollView style={styles.container}>
      <Image style={styles.mainImage} source={require('../assets/main.png')} />
      <ScrollView style={styles.middleContainer} horizontal indicatorStyle={"white"}>
      <TouchableOpacity style={styles.middleButtonAll} onPress={()=>{category('전체보기')}}><Text style={styles.middleButtonTextAll}>전체보기</Text></TouchableOpacity>
        <TouchableOpacity style={styles.middleButton01} onPress={()=>{category('생활')}}><Text style={styles.middleButtonText}>생활 정보</Text></TouchableOpacity>
        <TouchableOpacity style={styles.middleButton02} onPress={()=>{category('건강')}}><Text style={styles.middleButtonText}>성장 / 건강</Text></TouchableOpacity>
        <TouchableOpacity style={styles.middleButton03} onPress={()=>{category('필수')}}><Text style={styles.middleButtonText}>필수 정보</Text></TouchableOpacity>
        <TouchableOpacity style={styles.middleButton04} onPress={()=>{navigation.navigate('LikePage')}}><Text style={styles.middleButtonText}>꿀팁 찜</Text></TouchableOpacity>
      </ScrollView>
      <View style={styles.cardContainer}>
         {/* 하나의 카드 영역을 나타내는 View */}
         {
          cateState.map((content,i)=>{
            return (<Card content={content} key={i} navigation={navigation}/>)
          })
        }
        </View>
    </ScrollView>)
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop:50,
    marginLeft:20
  },
  mainImage: {
    //컨텐츠의 넓이 값
    width:'130%',
    //컨텐츠의 높이 값
    height:200,
    //컨텐츠의 모서리 구부리기
    borderRadius:100,
    marginTop:20,
    //컨텐츠 자체가 앱에서 어떤 곳에 위치시킬지 결정(정렬기능)
    alignSelf:"center"
  },
  middleContainer:{
    marginTop:20,
    marginLeft:10,
    height:60
  },
  middleButtonAll: {
    width:100,
    height:40,
    padding: 13,
    backgroundColor:"#005b9f",
    borderColor:"deeppink",
    borderRadius:15,
    margin:7
  },
  middleButton01: {
    width:100,
    height:40,
    padding:13,
    backgroundColor:"#a1dfff",
    borderColor:"deeppink",
    borderRadius:15,
    margin:7
  },
  middleButton02: {
    width:100,
    height:40,
    padding: 13,
    backgroundColor:"#73c8ff",
    borderRadius:15,
    margin:7
  },
  middleButton03: {
    width:100,
    height:40,
    padding: 13,
    backgroundColor:"#45bcff",
    borderRadius:15,
    margin:7
  },
  middleButton04: {
    width:100,
    height:40,
    padding: 13,
    backgroundColor:"#f886a8",
    borderRadius:15,
    margin:7
  },
  middleButtonText: {
    color:"#fff",
    //텍스트의 현재 위치에서의 정렬 
    textAlign:"center",
    fontWeight:"450",
    fontSize: 15,
  },
  middleButtonTextAll: {
    color:"#fff",
    //텍스트의 현재 위치에서의 정렬 
    textAlign:"center",
    fontWeight:"450",
    fontSize: 15,
  },
  cardContainr: {
    marginTop:10,
    marginLeft:10
  },
  aboutButton: {
    backgroundColor:"pink",
    width:100,
    height:40,
    borderRadius:10,
    alignSelf:"flex-end",
    marginRight:20,
    marginTop:10
  },
  aboutButtonText: {
    color:"#fff",
    textAlign:"center",
    marginTop:10
  }
});