import React, {Component} from 'react';
import {CheckBox} from 'react-native-elements';

export default class CustomCheckBox extends Component {
  static defaultProps = {
    _marginRight: 0,
    _paddingRight: 0,
    _checked: false,
    _onPress: () => null,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CheckBox
        activeOpacity={1}
        containerStyle={{
          backgroundColor: 'transparent',
          borderWidth: 0,
          marginLeft: 0,
          marginRight: this.props._marginRight,
          paddingRight: this.props._paddingRight,
        }}
        checked={this.props._checked}
        onPress={() => this.props._onPress()}
        checkedColor="white"
      />
    );
  }
}
