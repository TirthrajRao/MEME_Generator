import React, {Component} from 'react';
import {Platform,CameraRoll, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions ,ScrollView,ImageBackground,  Alert,
  ProgressBarAndroid,
  ToastAndroid,
  PermissionsAndroid} from 'react-native';
  import ImagePicker from 'react-native-image-picker';
  import {AsyncStorage} from 'react-native';
  import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
  import { captureScreen } from "react-native-view-shot";
  import RNFetchBlob from "rn-fetch-blob";
  import RNFS from 'react-native-fs';
  import { Buffer } from 'buffer'


  import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
  export default class EditImage extends React.Component {

    constructor(props){
      super(props);
      this.state = {

        topText:'',
        bottomText:'',


        uploading: false,

        PhotoName: "",
        pic:[],
        uri:[],

        uriImg:null,
        fileName:[],
        resBase64:undefined


      }}

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

      actualDownload = () => {

        // let dirs = RNFetchBlob.fs.dirs;
        let Toptext = this.state.topText
        let url = this.state.uriImg
        let name = this.state.fileName
        let img = url.split('//')[1]
        console.log('+++++++++++',img);

        let dirs = RNFetchBlob.fs.dirs.PictureDir;
        const file_path = dirs +'/'+name
      //  console.log("file path--",file_path);

      RNFS.readFile(this.state.uriImg, 'base64')
      .then(res =>{
        this.setState({resBase64:res})
        let base64 = this.state.resBase64
          //console.log("---res---",base64);

        
          console.log("--------text1---2--------",topText)
         writeText({path: name, text: this.state.topText})
          .then(function(result) {
            console.log('result--------', result);
            fs.writeFile('./tmp/F5lPa5p.jpg', result);
          })
          .fail(function(err) {
            console.log('error', err);
          });
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


    render() {

      const {loading, status} = this.state;


      const {navigation} = this.props;
      let { image } = this.state;
      return (
        <ScrollView>

        <View style={styles.container}>
        <TextInput
        style={styles.input}
        returnKeyType="done"
        placeholder="top text"
        onChangeText={(t) => this.setState({ topText: t })}
        />
        <TextInput
        style={styles.input}
        returnKeyType="done"
        placeholder="bottom text"
        onChangeText={(t) => this.setState({ bottomText: t })}
        />

        <View style={{ flexDirection: 'row' }}>


        <TouchableOpacity
        onPress={() => this.downloadFile()}
        style={styles.button}>
        <Text  style={{color:'#fff'}}>save!</Text>
        </TouchableOpacity>

        <Menu
        ref={this.setMenuRef}
        button={<Text style={styles.button} onPress={this.showMenu}>Load</Text>} >
        <MenuItem  onPress={() => navigation.navigate('AddImage')}>From app</MenuItem>
        <MenuDivider />
        <MenuItem onPress={this.pickImage}>From Gallery</MenuItem>
        </Menu>
        </View>


        <ImageBackground
        source={{ uri: this.state.uriImg }}
        style={{
          height: 300,
          width: 300,
          position: 'relative', 
          top: 2,
          left: 2
        }} >
        <Text
        style={[styles.text, { top: 5 }]}>
        {this.state.topText}
        </Text>
        <Text
        style={[styles.text, { bottom: 5 }]}>
        {this.state.bottomText}
        </Text>
        </ImageBackground>
        </View>
        </ScrollView>
        );
      }

      pickImage = async () => {


        DocumentPicker.show({
          filetype: [DocumentPickerUtil.images()],
        },(error,res) => {
          console.log(
          "uri---", res.uri,
          "type----",res.type, 
          "file name---",res.fileName,
          "size-----",res.fileSize
          );
          this.setState({uriImg:res.uri,fileName:res.fileName})

          console.log("this.state.uriImg",this.state.uriImg);
        });
      };
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
      text: {
        position: 'absolute',
        left: 5, right: 5, padding: 5,
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        color: 'white',
        backgroundColor: 'transparent',
      },
      button: {
        width:80,
        margin: 5,
        padding: 5,
        backgroundColor: 'purple',
        alignItems: 'center',
        color:'#fff'
      },
      container: {

        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
      },
    });

