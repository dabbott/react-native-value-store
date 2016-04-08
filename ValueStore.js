import React, {
  Component,
  View,
  AsyncStorage,
} from 'react-native'

class ValueStore extends Component {
  constructor() {
    super()
    this.state = {
      value: null,
      loading: true,
    }
    this.onChange = this.onChange.bind(this)
  }
  componentWillMount() {
    const {storageKey, defaultValue, deserialize} = this.props
    
    if (! storageKey) {
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
  onChange(value) {
    const {storageKey, serialize} = this.props
    
    if (! storageKey) {
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
    })
  }
  render() {
    const {value, loading} = this.state
    const {style} = this.props
    return (
      <View style={style}>
        {this.props.render(value, loading, this.onChange)}
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
}
  
ValueStore.defaultProps = {
  render: () => {},
  serialize: (value) => JSON.stringify(value),
  deserialize: (str) => JSON.parse(str),
}

export default ValueStore
