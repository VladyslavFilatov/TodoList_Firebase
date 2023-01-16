import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text} from 'react-native'

const TaskList = ({description, date}) => {
  return (
    <View style={styles.container}>
      <Text>Description : {description}</Text>
      <Text>date: {date}</Text>
    </View>
  )
}

TaskList.propTypes = {
  description: PropTypes.string,
  date: PropTypes.string,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TaskList
