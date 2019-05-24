import React from 'react'
import { TouchableOpacity, Image, View, Text, Platform, Dimensions, StyleSheet, ScrollView,TextInput ,  ProgressBarAndroid,
  ToastAndroid,
  PermissionsAndroid} from 'react-native'
  import Marker from 'react-native-image-marker'
  import Picker from 'react-native-image-picker'
  const icon = require('../assets/icon.jpeg')
  const bg = require('../assets/bg.png')
  const base64Bg = require('./bas64bg').default 
  import RNFetchBlob from "rn-fetch-blob";
  import RNFS from 'react-native-fs';
  import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

  import { Container, Header, Content, Card, CardItem, Body } from 'native-base';
  import {AsyncStorage} from 'react-native';
  import Icon from "react-native-vector-icons/MaterialIcons";
  const { width } = Dimensions.get('window')
  export default class AddImage extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        uri: '',
        uritop:'',
        image: undefined,
        marker: icon,
        markImage: true,

        topText:'',
        bottomText:'',
        name:[],
        data:[]

      }
    }

    actualDownload = () => {

      let url = this.state.uri
      let name = this.state.name
      let dirs = RNFetchBlob.fs.dirs.PictureDir;
      console.log("--path--",dirs)
      const file_path = dirs +'/'+name

      RNFS.readFile(this.state.uri, 'base64')
      .then(res =>{
        this.setState({resBase64:res})
        let base64 = this.state.resBase64
        RNFS.writeFile(file_path,base64,'base64')
       
        alert("Your file has been downloaded to Pictures folder!")
        this.setState({uri:''})
        .catch((error) => {
          console.log("err",error);
          alert(JSON.stringify(error));
        });
      });
    }

    async downloadFile() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to memory to download the file"
          }
          );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.actualDownload();
        } else {
          Alert.alert(
            "Permission Denied!",
            "You need to give storage permission to download the file"
            );
        }
      } catch (err) {
        console.warn(err);
      }
    }

    render () {

      const {navigation} = this.props;
      return (
        <ScrollView style={styles.container}>
        <View >
        <Header style={{ backgroundColor: '#ffffff',height:30}}>
        <View style={{flex:6,flexDirection:'column'}}>
        <Text style={styles.text1}>MEME Generator</Text>
        </View>
        <View style={{flex:2,flexDirection:'column'}}></View>
        <View style={{flex:2,flexDirection:'column'}}>
        <Icon name="insert-photo" color="#000" size={30} style={styles.icon} onPress={() => this._pickImage('image')}/>
        </View>

        <View style={{flex:2,flexDirection:'column'}}>
        <Icon name="photo-album" color="#000" size={30} style={styles.icon} onPress={() => navigation.navigate('SaveImage')}/>
        </View>
        </Header>

        </View>



        <View style={styles.first}>
        <TextInput
        ref={(input)=>{this.topText=input}}
        style={styles.input}
        returnKeyType="done"
        placeholder="top text"
        onChangeText={(text) => this.setState({ topText: text })}/>

        <TextInput
        ref={(input)=>{this.bottomText=input}}
        style={styles.input}
        returnKeyType="done"
        placeholder="bottom text"
        onChangeText={(text) => this.setState({ bottomText: text })}/>

        <View style={styles.view}>
        <View style={{flex:6,flexDirection:'column'}}></View>
        <View style={{flex:4,flexDirection:'column'}}>
        <TouchableOpacity
        style={styles.btn}
        onPress={() => this._markByPosition(this.topText.clear(),this.bottomText.clear())}>
        <Icon name="create" color="#000" size={20}/>
        <Text style={styles.text} >Generate</Text>
        </TouchableOpacity>
        </View>
        <View style={{flex:4,flexDirection:'column'}}>
        <TouchableOpacity
        style={styles.btn}
        onPress={() => this.downloadFile()}>
        <Icon name="arrow-downward" color="#000" size={20}/>
        <Text style={styles.text} >Save</Text>
        </TouchableOpacity>
        </View>
        </View>
        </View>

        <View
        style={{flex: 1}}
        >
        {
          this.state.show
          ? <Image source={{uri: this.state.uri}} resizeMode='contain' style={styles.preview} />
          : <Image source={{uri: this.state.image}} resizeMode='contain' style={styles.preview} />
        }
        </View>
        </ScrollView>
        )
    }
    setBottomText = () => {
      console.log("--topfunction--bottom---",this.state.uritop)

      Marker.markText({
        src: this.state.uritop, 
        text:this.state.bottomText,
        position: 'bottomCenter',
        color: '#ffffff',
        backgroundColor: 'red',
        fontName: 'Arial-BoldItalicMT', 
        fontSize: 55,
        scale: 1,
        quality: 100,
        opacity:2.5,

        shadowStyle: {
          dx: 2,
          dy: 2,
          radius: 2,
          color:'#000000'
        }
      })
      .then((path) => {
        console.log('=======bottom=============path================',path);
        this.setState({
          show: true,
          uri: Platform.OS === 'android' ? 'file://' + path : path
        })
      }).catch((err) => {
        console.log(err)

      })
    };

    _markByPosition = () => {
      Marker.markText({
        src: this.state.image,
        text: this.state.topText, 
        position:  'topCenter' ,        
        color: '#ffffff',
        fontName: 'Arial-BoldItalicMT', 
        fontSize: 55,
        scale: 1,
        quality: 100,
        opacity:2.5,
       
          shadowStyle: {
            dx: 2,
            dy: 2,
            radius: 2,
            color:'#000000'
          }
        })
      .then((path) => {
        console.log('==========top==========path================',path);
        this.setState({
          show: true,
          uritop: Platform.OS === 'android' ? 'file://' + path : path
        })
        this.setBottomText()
      }).catch((err) => {
        console.log(err)

      })
    }
    _pickImage = (type) => {

      let options = {
        title: 'MEME Generator',
        takePhotoButtonTitle: 'Camera',
        chooseFromLibraryButtonTitle: 'Gallery',
        cancelButtonTitle: 'cancel',
        quality: 0.5,
        mediaType: 'photo',
        maxWidth: 2000,
        noData: true,
        maxHeight: 2000,
        dateFormat: 'yyyy-MM-dd HH:mm:ss',
        allowsEditing: false
      }
      Picker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled photo picker')
        } else if (response.error) {
          console.log('ImagePickerManager Error: ', response.error)
        } else if (response.customButton) {

        } else {

          const uri = response.uri
          this.setState({name:response.fileName})
          console.log("res--------------",response)
          if (type === 'image') {
            this.setState({
              image: uri
            })
          } else {
            this.setState({
              marker: uri
            })
          }
        }
      })
    }
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20
    },
    view: {

      /* justifyContent: 'center',*/
      flexDirection: 'row',
      flexWrap: 'wrap',

    },
    btn: {
      flexDirection: 'row',
      padding: 10,
      borderRadius: 3,
      backgroundColor: '#44B4B4',
      margin: 5,
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: 15,
      color: 'black'
    },
    preview: {
      // width,
      width:'100%',
      height: 300,
      flex: 1
    },
    input: {
      alignSelf: 'stretch',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      margin: 5,
      padding: 5,
    },
    text1: {
      fontSize: 20,
      color:'black',
      justifyContent: 'center',
      marginBottom:15
    },
    icon:{
      marginBottom:15,
      marginLeft:20
    },
    first:{
      marginTop:10,
      elevation:5,
      padding:10
    }
  })
