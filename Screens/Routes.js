import React from 'react'
import { Router, Scene } from 'react-native-router-flux'
import {Platform, Button, View, TouchableOpacity} from 'react-native';
import AddImage from './AddImage'
import EditImage from './EditImage'
import Icon from "react-native-vector-icons/MaterialIcons";

import {createStackNavigator, createAppContainer} from 'react-navigation';

const MainNavigator = createStackNavigator({

	AddImage: {
		screen: AddImage,
		navigationOptions:  {
				title: 'MEME Generator',
			// header: null
		}	
	},
	EditImage:{
		screen: EditImage,
		navigationOptions: {
			title: 'MEME Generator',
			headerRight: (
				<TouchableOpacity  onPress={() => this.props.navigation.navigate('AddImage')}>
				<Icon name="library-books" color="#000" size={30} style={{marginRight:15}} />
				</TouchableOpacity>
				)
		}
	},

});

const Routes = createAppContainer(MainNavigator);
export default Routes;


// <View style={{flexDirection: "row",justifyContent: "space-evenly",justifyContent: "space-evenly"}}>
//       	 <TouchableOpacity>

//       	 <Icon name="add" color="#000" size={30} style={{marginRight:15}} /></TouchableOpacity>
//       	 	 <Icon name="library-books" color="#000" size={30} style={{marginRight:15}} />
     //       	 	 </View>