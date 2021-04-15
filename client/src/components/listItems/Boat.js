import React, { useState } from 'react'
import { Card, List } from 'antd'

import { EditOutlined } from '@ant-design/icons'
import UpdatePerson from '../forms/UpdatePerson'
import RemovePerson from '../buttons/RemovePerson'

const getStyles = () => ({
  card: {
    // width: '500px'
    width: '99%'
  }
})

const Boat = props => {
  const [id] = useState(props.id)
  const [year, setYear] = useState(props.year)
  const [make, setMake] = useState(props.make)
  const [model, setModel] = useState(props.model)
  const [price, setPrice] = useState(props.price)
  const [personId, setPersonId] = useState(props.personId)
  const [editMode, setEditMode] = useState(false)
  const styles = getStyles()

  const boatInfo = () => {
    return `${props.year} / ${props.make} / ${props.model} / ${props.price}`
  }

  const updateStateVariable = (updatedYear, updatedMake, updatedModel, updatedPrice, updatedPersonId) => {
    setYear(updatedYear);
    setMake(updatedMake);
    setModel(updatedModel);
    setPrice(updatedPrice);
    setPersonId(updatedPersonId);
  }

  const handleButtonClick = () => setEditMode(!editMode)

  return (
    <List.Item key={props.id}>
      {editMode ? (
        null
      ) : (
          <Card
            title="Boat"
            type="inner"
            actions={[
              <EditOutlined key='edit' onClick={handleButtonClick} />,
              // <RemovePerson id={id} firstName={firstName} lastName={lastName} />
            ]}
            style={styles.card}
          >
            {boatInfo()}
          </Card>
        )}
    </List.Item>
  )
}

export default Boat