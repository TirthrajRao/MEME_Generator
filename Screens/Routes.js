import React from 'react'
import { Router, Scene } from 'react-native-router-flux'
import {Platform, Button, View, TouchableOpacity} from 'react-native';
import AddImage from './AddImage'
import SaveImage from './SaveImage'
import Icon from "react-native-vector-icons/MaterialIcons";

import {createStackNavigator, createAppContainer} from 'react-navigation';

const MainNavigator = createStackNavigator({

	AddImage: {
		screen: AddImage,
		navigationOptions:  {
				header: null
			
		}	
	},
	SaveImage:{
		screen: SaveImage,
		navigationOptions: {
			title: 'Saved Image',
		}
	},

});

const Routes = createAppContainer(MainNavigator);
export default Routes;
