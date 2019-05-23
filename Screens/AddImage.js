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
// import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStorage} from 'react-native';

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

    _switch = () => {
      this.setState({
        markImage: !this.state.markImage
      })
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
        this.saveData(url)
        alert("Your file has been downloaded to Pictures folder!")
        this.setState({uri:''})
        .catch((error) => {
          console.log("err",error);
          alert(JSON.stringify(error));
        });
      });
    }

  
    saveData = async (url) => {
      this.setState(prevState =>({
                data: [...prevState.data,url]
              })) 
      console.log("---uri---",this.state.data)
      try {
        await AsyncStorage.setItem('url',JSON.stringify(this.state.data) );

      } catch (e) {
          console.log(e)
  }
}

    async downloadFile() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to memory to download the file "
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
    _menu = null;
    setMenuRef = ref => {
      this._menu = ref;
    };

    hideMenu = () => {
      this._menu.hide();
    };

    showMenu = () => {
      this._menu.show();
    };
    render () {
   
      const {navigation} = this.props;
      return (
        <ScrollView style={styles.container}>
        <View>
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
        </View>

        <View style={styles.view}>


        <Menu
        ref={this.setMenuRef}
        button={<Text  style={[styles.btn,styles.text]} onPress={this.showMenu}>Choose Image</Text>} >
        <MenuItem onPress={() => navigation.navigate('EditImage')}>From app</MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => this._pickImage('image')}>From Gallery</MenuItem>
        </Menu>

        <TouchableOpacity
        style={styles.btn}
        onPress={() => this._markByPosition(this.topText.clear(),this.bottomText.clear())}>
        <Text style={styles.text} >Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.btn}
        onPress={() => this.downloadFile()}>
        <Text style={styles.text} >Save</Text>
        </TouchableOpacity>

        </View>

        <View
        style={{flex: 1}}
        >
        {
          this.state.show
          ? <Image source={{uri: this.state.uri}} resizeMode='contain' style={styles.preview} />
          : null
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
        fontName: 'Arial-BoldItalicMT', 
        fontSize: 55,
        scale: 1,
        quality: 100,
        shadowStyle: {
          dx: 10.5,
          dy: 20.8,
          radius: 20.9,
          color:'#ffffff'
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
      shadowStyle: {
        dx: 10.5,
        dy: 20.8,
        radius: 20.9,
        color:'#ffffff'
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
    this.hideMenu()
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
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  btn: {
    padding: 10,
    borderRadius: 3,
    backgroundColor: '#00BF00',
    margin: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 15,
    color: 'white'
  },
  preview: {
    width,
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
})
