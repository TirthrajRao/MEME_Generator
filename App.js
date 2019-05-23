
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Routes from './Screens/Routes';
import AddImage from './Screens/AddImage';
import SaveImage from './Screens/SaveImage';

  export default class App extends React.Component {
  render() {
    return (
     
        <Routes />
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
 
});
