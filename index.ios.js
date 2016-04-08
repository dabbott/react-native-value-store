import ValueStore from './ValueStore'

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicatorIOS,
} from 'react-native'

class Project extends Component {
  render() {
    return (
      <View style={{flex: 1, paddingTop: 40, alignItems: 'center',}}>
        <Text style={{margin: 20}}>List Example</Text>
        <ValueStore
          storageKey={'testing'}
          defaultValue={['a', 'b', 'c']}
          render={(data, loading, onChange) => {
            console.log('data', data, 'loading', loading)
            return loading ? (
              <Text>Loading...</Text>
            ) : (data.map((item, i) => (
              <TouchableOpacity key={i}
                onPress={() => {onChange(['hi', ...data])}}
                activeOpacity={75 / 100}>
                <Text>Test: {item}</Text>
              </TouchableOpacity>
            )))
          }}
        />
        <Text style={{margin: 20}}>Number Example</Text>
        <ValueStore
          storageKey={"TEST"}
          style={{backgroundColor: "rgb(74,144,226)"}}
          defaultValue={Math.random()}
          render={(value, loading, onChange) => {
            return loading ? (
              <Text>Loading...</Text>
            ) : (
              <TouchableOpacity onPress={() => {onChange(Math.random())}}>
                <Text>Value: {value}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('Project', () => Project);