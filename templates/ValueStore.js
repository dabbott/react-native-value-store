<ValueStore
  storageKey={"TEST"}
  style={{backgroundColor: "rgb(74,144,226)"}}
  defaultValue={Math.random()}
  debugMenu={false}
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