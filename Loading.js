import React, {Component} from 'react';
import {StyleSheet, Image, View, StatusBar, Animated} from 'react-native';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: new Animated.Value(0),
      position: new Animated.ValueXY({x: 0, y: 0}),
    };
  }
  componentDidMount() {
    this._fadeIn();
  }
  _fadeIn() {
    Animated.timing(this.state.value, {
      toValue: 1,
      duration: 600,
      delay: 100,
    }).start();
  }
  _getStyle() {
    return {
      height: '35%',
      width: '35%',
      opacity: this.state.value,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#011536" barStyle="light-content" />
        <Animated.View style={this._getStyle()}>
          <Image
            style={styles.image1}
            source={require('./image/splashImage.png')}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#011536', // 후보4
  },

  image1: {
    height: '100%',
    width: '100%',
  },
});
