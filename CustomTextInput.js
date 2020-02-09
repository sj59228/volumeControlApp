import React, {Component} from 'react';
import {TextInput, StyleSheet} from 'react-native';

export default class CustomTextInput extends Component {
  static defaultProps = {
    _value: false,
    _onChangeText: () => null,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TextInput
        style={styles.inputBox}
        keyboardType={'numeric'}
        maxLength={20}
        value={this.props._value}
        onChangeText={value => this.props._onChangeText(value)}
      />
    );
  }
}

const styles = StyleSheet.create({
  inputBox: {
    borderColor: '#aaa',
    color: 'white',
    fontSize: 21,
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 7,
    padding: 5,
  },
});
