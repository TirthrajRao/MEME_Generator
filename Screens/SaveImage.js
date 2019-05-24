  import React, {Component} from 'react';
  import {Platform,CameraRoll,FlatList, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions ,ScrollView,ImageBackground} from 'react-native';
  import {AsyncStorage} from 'react-native';
  import RNFetchBlob from "rn-fetch-blob";
  import { Modal } from 'react-native';
  import ImageViewer from 'react-native-image-zoom-viewer';
  import Icon from "react-native-vector-icons/MaterialIcons";
  import RNFS from 'react-native-fs';
  const { WIDTH, HEIGHT } = Dimensions.get("window");

  var imageUrls = [];
  export default class SaveImage extends React.Component {
      constructor (props) {
          super(props)
          this.state = {
              image:[],
              visible:false,
              selectedImage: undefined
          }
      }

      componentWillMount = async()=>{
          let dirs = RNFetchBlob.fs.dirs.PictureDir;
          console.log("--path--",dirs);
          console.log("filepath in get image screen", dirs);
          RNFS.readDir(dirs)
          .then((allImages) => {
              console.log("allImages", allImages)
              this.setState({image : allImages})

          })
          .catch((err) => {
              console.log("err", err);
              console.log(err.message, err.code);
          });
      }
      prevImage(image){
          console.log("call----------------------", image);
          this.setState({visible:true, selectedImage: 'file://' +image});
      }

      render() {
          return (
              <React.Fragment>
              <View>
              <FlatList
              data={this.state.image}
              renderItem={ ({item}) =>
              <View style={styles.GridViewContainer} >
              <TouchableOpacity onPress={()=>{this.prevImage(item.path)}}>
              <Image source={{uri: 'file://' + item.path}} style={styles.image} />
              </TouchableOpacity>
              </View>
          }
          numColumns={2}
          />
          </View>
          <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.visible}
          onRequestClose={() => {
          }}>
          <View >
          <View >
          <View style={{ flexDirection: 'row', justifyContent:'flex-end' }}>
          <TouchableOpacity onPress={() => this.setState({ visible: false })} >
          <Icon name="close" color="grey" size={30} />
          </TouchableOpacity>
          </View>
          <View style={{elevation:5,padding:10}}>
          <Image source={{uri: this.state.selectedImage}} style={styles.selectImage} />
          </View>
          </View>
          </View>
          </Modal>
          </React.Fragment>

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
          height:'100%',

      },
      selectImage: {
          height: 600,
          width: "100%"
      },
      GridViewContainer: {
          flex:1,
          height: 150,
          margin: 5,
          elevation:5,
          backgroundColor: '#ffffff'
      },
  });

