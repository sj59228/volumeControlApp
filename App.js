import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Alert,
  TextInput,
  ToastAndroid,
  BackHandler,
} from 'react-native';
// import Loading from './Loading';
import CustomButton from './CustomButton';
import {CheckBox} from 'react-native-elements';
import SystemSetting from 'react-native-system-setting';
import BackgroundTimer from 'react-native-background-timer';
import SplashScreen from 'react-native-splash-screen';

export default class App extends Component {
  volumeListener = null;
  volTypes = ['music', 'system', 'call', 'ring', 'alarm', 'notification'];
  volIndex = 0;
  constructor(props) {
    super(props);
    this.state = {
      volume: 0,
      volType: this.volTypes[this.volIndex],
      second: '600',
      _volume: '1',
      flag: false,
      increaseFlag: false,
      decreaseFlag: true,
      status: '실행 중이지 않습니다',
      signStatus: '감소',
      timer: null,
    };
  }
  async componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 200);

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.setState({
      volume: await SystemSetting.getVolume(this.state.volType),
    });
    this.volumeListener = SystemSetting.addVolumeListener(data => {
      const volume = this.isAndroid ? data[this.state.volType] : data.value;
      this.setState({
        volume: volume,
      });
    });
  }

  componentWillUnmount() {
    this.exitApp = false;
    SystemSetting.removeListener(this.volumeListener);
    BackgroundTimer.clearInterval(this.state.timer);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
    if (this.exitApp == undefined || !this.exitApp) {
      ToastAndroid.show(
        '한번 더 누르면 실행이 멈추고 종료됩니다.',
        ToastAndroid.SHORT,
      );
      this.exitApp = true;

      this.timeout = setTimeout(
        () => {
          this.exitApp = false;
        },
        2000, // 2초
      );
    } else {
      clearTimeout(this.timeout);

      BackHandler.exitApp(); // 앱 종료
    }
    return true;
  };

  _changeVol(value) {
    SystemSetting.setVolume(value, {
      type: this.state.volType,
      playSound: false,
      showUI: false,
    });
    this.setState({
      volume: value,
    });
  }

  _startButton() {
    if (this.state.flag) {
      Alert.alert(
        '알림',
        '어플이 이미 실행 중입니다!',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    }
    if (this.state.decreaseFlag && this.state.volume == 0) {
      Alert.alert(
        '알림',
        '볼륨이 이미 0입니다!',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    }
    if (this.state.increaseFlag && this.state.volume == 1) {
      Alert.alert(
        '알림',
        '볼륨이 이미 최대입니다!',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    }
    if (!this.state.second) {
      Alert.alert(
        '경고',
        '시간을 입력해주세요!',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    } else if (!this.state._volume) {
      Alert.alert(
        '경고',
        '음량을 입력해주세요!',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    }
    if (this.state.second < 0) {
      Alert.alert(
        '경고',
        '0보다 큰 숫자를 입력해주세요!',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    } else if (this.state._volume < 0) {
      Alert.alert(
        '경고',
        '0보다 큰 숫자를 입력해주세요!',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    }
    if (this.state.second == 0 || this.state._volume == 0) {
      Alert.alert(
        '경고',
        '0보다 큰 숫자를 입력해주세요!',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    }

    Alert.alert(
      '시작',
      `${this.state.second}초마다 ${this.state._volume}씩 음량을 ${this.state.signStatus}합니다`,
      [
        {
          text: '넹',
        },
      ],
      {cancelable: true},
    );
    this._onStartVolumeControl();
    var status = '음량이 ' + this.state.signStatus + '하고 있습니다';
    this.setState({flag: true, status: status});
  }

  _stopButton() {
    if (!this.state.flag) {
      Alert.alert(
        '알림',
        '어플이 실행 중이지 않습니다!',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    }
    Alert.alert(
      '정지',
      '정말로 멈추시겠습니까?',
      [
        {
          text: '아니오',
        },
        {
          text: '네',
          onPress: () => {
            this._onStopVolumeControl();
            this.setState({flag: false, status: '실행 중이지 않습니다'});
          },
        },
      ],
      {cancelable: true},
    );
  }

  _onStartVolumeControl() {
    var value = parseFloat(this.state._volume) * 0.0666;
    var currentVolume;

    let timer = BackgroundTimer.setInterval(async () => {
      currentVolume = await SystemSetting.getVolume(this.state.volType);
      if (this.state.increaseFlag) {
        currentVolume = currentVolume + value + 0.01;
      } else {
        currentVolume -= value;
      }
      if (currentVolume <= 0.05) {
        this._changeVol(0);
        this.setState({
          flag: false,
          status: '실행 중이지 않습니다',
        });
        Alert.alert(
          '정지',
          '소리가 0이 되었습니다!',
          [
            {
              text: '넹',
            },
          ],
          {cancelable: true},
        );
        BackgroundTimer.clearInterval(this.state.timer);
        return;
      } else if (currentVolume >= 0.96) {
        this._changeVol(1);
        this.setState({
          flag: false,
          status: '실행 중이지 않습니다',
        });
        Alert.alert(
          '정지',
          '소리가 최대가 되었습니다!',
          [
            {
              text: '넹',
            },
          ],
          {cancelable: true},
        );
        BackgroundTimer.clearInterval(this.state.timer);
        return;
      }
      this._changeVol(currentVolume);
    }, this.state.second * 1000);
    this.setState({timer});
  }

  _onStopVolumeControl() {
    BackgroundTimer.clearInterval(this.state.timer);
  }

  _onPushIncreaseButton() {
    if (this.state.flag) {
      Alert.alert(
        '알림',
        '실행 중에는 변경이 불가능합니다',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    }
    if (!this.state.increaseFlag) {
      this.setState({
        signStatus: '증가',
        increaseFlag: !this.state.increaseFlag,
        decreaseFlag: !this.state.decreaseFlag,
      });
    }
  }

  _onPushDecreaseButton() {
    if (this.state.flag) {
      Alert.alert(
        '알림',
        '실행 중에는 변경이 불가능합니다',
        [
          {
            text: '넹',
          },
        ],
        {cancelable: true},
      );
      return;
    }
    if (!this.state.decreaseFlag) {
      this.setState({
        signStatus: '감소',
        increaseFlag: !this.state.increaseFlag,
        decreaseFlag: !this.state.decreaseFlag,
      });
    }
  }
  _onChangeSecond(second) {
    this.setState({
      second: second.replace(/[^0-9]/g, ''),
    });
  }
  _onChangeVolume(_volume) {
    this.setState({
      _volume: _volume.replace(/[^0-9]/g, ''),
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={styles.header} />
        <View style={styles.title}>
          <Text style={{fontSize: 30, color: 'white'}}>지금은,</Text>
          <Text style={{fontSize: 25, color: 'white'}}>
            {this.state.status}
          </Text>
        </View>
        <View style={styles.content}>
          <View style={styles.content_0}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  paddingTop: 16,
                  right: 0,
                }}>
                증가
              </Text>
              <CheckBox
                activeOpacity={1}
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  marginLeft: 0,
                }}
                checked={this.state.increaseFlag}
                onPress={() => this._onPushIncreaseButton()}
                checkedColor="white"
              />
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  paddingTop: 16,
                  right: 0,
                }}>
                감소
              </Text>
              <CheckBox
                activeOpacity={1}
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  paddingRight: 0,
                }}
                checked={this.state.decreaseFlag}
                onPress={() => this._onPushDecreaseButton()}
                checkedColor="white"
              />
            </View>
          </View>
          <View style={styles.content_1}>
            <Text style={styles.text_1}>시간</Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={second => this._onChangeSecond(second)}
              value={this.state.second}
              keyboardType={'numeric'}
              maxLength={20}
            />
          </View>
          <View style={styles.content_1}>
            <Text style={styles.text_1}>음량</Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={_volume => this._onChangeVolume(_volume)}
              value={this.state._volume}
              keyboardType={'numeric'}
              maxLength={20}
            />
          </View>
        </View>
        <View style={styles.explanation}>
          <Text style={{fontSize: 14, color: 'white'}}>
            ※ 현재 음량 :{' '}
            {Math.round(Math.floor(this.state.volume * 100) / 6.7)} {'\n'}※
            소리가 {this.state.second}
            초마다 {this.state._volume}씩 {this.state.signStatus}합니다.
          </Text>
        </View>
        <View style={styles.footer}>
          <CustomButton
            buttonColor={'#444'}
            title={'시작'}
            onPress={this._startButton.bind(this)}
          />
          <CustomButton
            buttonColor={'#023e73'}
            title={'정지'}
            onPress={this._stopButton.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  header: {
    width: '100%',
    height: '5%',
    backgroundColor: 'black',
  },
  title: {
    width: '100%',
    height: '18%',
    justifyContent: 'center',
    backgroundColor: 'black',
    paddingBottom: 30,
  },
  explanation: {
    width: '100%',
    height: '5%',
    justifyContent: 'center',
    backgroundColor: 'black',
    paddingLeft: 10,
    paddingBottom: 25,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 60,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'black',
  },
  content_0: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingBottom: 5,
  },
  content_1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
    width: '100%',
    height: '43%',
    paddingTop: 10,
    paddingBottom: 80,
  },
  text_1: {
    color: 'white',
    fontSize: 30,
  },
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
  footer: {
    width: '100%',
    height: '20%',
    backgroundColor: 'black',
  },
});
