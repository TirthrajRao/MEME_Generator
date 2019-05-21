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

  const { width } = Dimensions.get('window')


  export default class AddImage extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        uri: '',
        image: undefined,
        marker: icon,
        markImage: true,

        topText:'',
        bottomText:'',
        name:[],

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
      let img = url.split('//')[1]
      console.log('+++++++++++',img);

      let dirs = RNFetchBlob.fs.dirs.PictureDir;
      const file_path = dirs +'/'+name

      RNFS.readFile(this.state.uri, 'base64')
      .then(res =>{
        this.setState({resBase64:res})
        let base64 = this.state.resBase64
        RNFS.writeFile(file_path,base64,'base64')
        alert("Your file has been downloaded to Pictures folder!")
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

    render () {

      return (
        <ScrollView style={styles.container}>
        <View>
        <TextInput
        style={styles.input}
        returnKeyType="done"
        placeholder="top text"
        onChangeText={(t) => this.setState({ topText: t })}/>

        <TextInput
        style={styles.input}
        returnKeyType="done"
        placeholder="bottom text"
        onChangeText={(t) => this.setState({ bottomText: t })}/>
        </View>

        <View style={styles.op}>
        <TouchableOpacity
        style={styles.btn}
        onPress={() => this._pickImage('image')}>
        <Text style={styles.text} >Pike Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.btn}
        onPress={() => this._markByPosition()}>
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

    _markByPosition = (type) => {

      Marker.markText({
        src: this.state.image,

        text: this.state.topText , 
        position:  'topCenter' , 
        // text:this.state.bottomText,
        // position: 'bottomCenter',
        color: '#ffffff',
        fontName: 'Arial-BoldItalicMT', 
        fontSize: 80,
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
        console.log('====================path================',path);
        this.setState({
          show: true,
          uri: Platform.OS === 'android' ? 'file://' + path : path
        })
      }).catch((err) => {
        console.log('====================================')
        console.log(err)
        console.log('====================================')
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
      // storageOptions: {
      //   skipBackup: true,
      //   path: 'imagePickerCache'
      // },
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
  op: {
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
