import React, {
  Component,
  View,
  AsyncStorage,
  TouchableOpacity,
  Text,
} from 'react-native'

const instances = {}

const addInstance = (storageKey, instance) => {
  instances[storageKey] = instances[storageKey] || new Set()
  instances[storageKey].add(instance)
}
  
const removeInstance = (storageKey, instance) => {
  instances[storageKey] && instances[storageKey].delete(instance)
}

const updateOtherInstances = (storageKey, thisInstance, newValue) => {
  instances[storageKey] && instances[storageKey].forEach(instance => {
    if (instance !== thisInstance) {
      instance.setState({value: newValue})
    }
  })
}

class ValueStore extends Component {
  constructor() {
    super()
    this.state = {
      value: null,
      loading: true,
    }
    this.onChange = this.onChange.bind(this)
    this.onReset = this.onReset.bind(this)
  }
  componentWillMount() {
    const {storageKey, defaultValue, deserialize} = this.props
    
    if (typeof storageKey === 'undefined') {
      throw new Error(`ValueStore missing required prop 'storageKey'`)
    }
    
    AsyncStorage.getItem(storageKey).then((value) => {
      try {
        value = deserialize(value)
      } catch (e) {
        throw new Error(`ValueStore unable to deserialize value: ${value}`)
      }
      
      if (value == null) {
        if (defaultValue != null) {
          this.setState({value: defaultValue})          
        }
      } else {
        this.setState({value})
      }
      
      this.setState({loading: false})
    })
  }
  componentDidMount() {
    const {storageKey} = this.props
    
    if (typeof storageKey !== 'undefined') {
      addInstance(storageKey, this)
    }
  }
  componentWillUnmount() {
    const {storageKey} = this.props
    
    if (typeof storageKey !== 'undefined') {
      removeInstance(storageKey, this)
    }
  }
  onChange(value) {
    const {storageKey, serialize, shouldSyncChanges} = this.props
    
    if (typeof storageKey === 'undefined') {
      throw new Error(`ValueStore missing required prop 'storageKey'`)
    }
    
    let serialized 
    
    try {
      serialized = serialize(value)  
    } catch (e) {
      throw new Error(`ValueStore unable to serialize value: ${value}`)
    }
    
    AsyncStorage.setItem(storageKey, serialized).then(() => {
      this.setState({value})
      shouldSyncChanges && updateOtherInstances(storageKey, this, value)
    })
  }
  onReset() {
    const {defaultValue} = this.props
    
    this.onChange(defaultValue)
  }
  renderDebugMenu() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(246,246,246,1)",
          position: 'absolute',
          top: -16,
          left: 0,
          opacity: 1,
          paddingHorizontal: 4,
          height: 16,
          borderWidth: 1,
          borderColor: "rgba(218,218,218,1)",
          borderRadius: 15,
        }}
        onPress={this.onReset}
        activeOpacity={75 / 100}>
        <Text style={{
          fontSize: 10,
          textAlign: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
        }}>Reset to default</Text>
      </TouchableOpacity>
    )
  }
  render() {
    const {value, loading} = this.state
    const {style, debugMenu} = this.props
    return (
      <View style={style}>
        {this.props.render(value, loading, this.onChange)}
        {debugMenu && this.renderDebugMenu()}
      </View>
    )
  }
}
  
ValueStore.propTypes = {
  storageKey: React.PropTypes.string.isRequired,
  defaultValue: React.PropTypes.any,
  render: React.PropTypes.func,
  serialize: React.PropTypes.func,
  deserialize: React.PropTypes.func,
  shouldSyncChanges: React.PropTypes.bool,
  debugMenu: React.PropTypes.bool,
}
  
ValueStore.defaultProps = {
  render: () => {},
  serialize: (value) => JSON.stringify(value),
  deserialize: (str) => JSON.parse(str),
  shouldSyncChanges: true,
  debugMenu: false,
}

export default ValueStore
