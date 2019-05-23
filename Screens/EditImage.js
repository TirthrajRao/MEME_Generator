  import React, {Component} from 'react';
  import {Platform,CameraRoll,FlatList, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions ,ScrollView,ImageBackground} from 'react-native';
  import {AsyncStorage} from 'react-native';
  import RNFetchBlob from "rn-fetch-blob";

  import RNFS from 'react-native-fs';



  export default class EditImage extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        image:[],
        sampleImage: ''
      }
    }

    componentDidMount = async()=>{
      let dirs = RNFetchBlob.fs.dirs.PictureDir;
      console.log("--path--",dirs);
      console.log("filepath in get image screen", dirs);
      RNFS.readDir(dirs)
      .then((allImages) => {
        console.log("allImages", allImages)
        this.setState({image : allImages})
        this.setState({ sampleImage: 'file://' + allImages[0].path})
      })
      .catch((err) => {
        console.log("err", err);
        console.log(err.message, err.code);
      });

      // const value = await AsyncStorage.getItem('url');
      // var data = JSON.parse(value);
      // console.log("---value--",data)

      /**/
    }

    render() {
      console.log("---render--",this.state.sampleImage)

      return (
       <View>
            <FlatList
                data={this.state.image}
                renderItem={ ({item}) =>
                    <View style={styles.GridViewContainer}>
                        <Image source={{uri: 'file://' + item.path}} style={styles.image}/>
                    </View>
                }
                numColumns={3}
            />
        </View>

     )
   }
  }

  const styles = StyleSheet.create({
    input: {
      alignSelf: 'stretch',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      margin: 5,
      padding: 5,
    },
    image:{
      height:100,
      // width:100,
    },
    GridViewContainer: {
     flex:1,
     height: 100,
     margin: 5,
     elevation:5,
     backgroundColor: '#ffffff'
   },

  });

