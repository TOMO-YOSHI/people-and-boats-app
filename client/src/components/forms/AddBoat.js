import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { Form, Input, Button, Menu, Dropdown, message, Space, Tooltip } from 'antd'

import { DownOutlined, UserOutlined } from '@ant-design/icons';

import { v4 as uuidv4 } from 'uuid'

import { ADD_BOAT, GET_BOATS, GET_PEOPLE } from '../../queries'

const AddBoat = () => {
  const [id] = useState(uuidv4())
  const [addBoat] = useMutation(ADD_BOAT)
  const [person, setPerson] = useState({ firstName: "Select", lastName: "Person" });
  const [personId, setPersonId] = useState(null);

  const [form] = Form.useForm()
  const [, forceUpdate] = useState()


  // Dropdown *******************
  const { loading, error, data } = useQuery(GET_PEOPLE)
  if (loading) return 'Loading...'
  if (error) return `Errror! ${error.message}`

  // To disable submit button at the beginning.
  // useEffect(() => {
  //   forceUpdate({})
  // }, [])

  const onFinish = values => {
    const { year, make, model, price } = values

    if (!year, !make, !model, !price, !personId) {
      alert("Something is messing");
      return;
    }

    addBoat({
      variables: {
        id, year, make, model, price, personId
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addBoat: {
          __typename: 'Boat',
          id, year, make, model, price, personId
        }
      },
      update: (proxy, { data: { addBoat } }) => {
        const data = proxy.readQuery({ 
          query: GET_BOATS,
          variables: {
            personId: addBoat.personId
          }
        })
        proxy.writeQuery({
          query: GET_BOATS,
          variables: {
            personId: addBoat.personId
          },
          data: {
            ...data,
            boats: [...data.boats, addBoat]
          }
        })
      }
    })
  }

  // function handleButtonClick(e) {
  //   message.info('Click on left button.');
  //   console.log('click left button', e);
  // }


  function handleMenuClick(e) {
    const selectedPerson = data.people.filter(person => person.id == e.key);
    if (selectedPerson[0]) {
      setPerson(selectedPerson[0]);
    }
    setPersonId(e.key);
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      {
        data.people.map((person) => (
          <Menu.Item key={person.id} icon={<UserOutlined />}>
            {person.firstName} {person.lastName}
          </Menu.Item>
          )
        )
      }
    </Menu>
  );

  return (
    <Form
      form={form}
      name='add-boat-form'
      layout='inline'
      onFinish={onFinish}
      size='large'
      style={{ marginBottom: '40px' }}
    >
      <Form.Item
        name='year'
        rules={[{ required: true, message: 'Please input a year of the boat!' }]}
      >
        <Input placeholder='i.e. 2020' />
      </Form.Item>
      <Form.Item
        name='make'
        rules={[{ required: true, message: 'Please input a maker of the boat!' }]}
      >
        <Input placeholder='i.e. Yamaha' />
      </Form.Item>
      <Form.Item
        name='model'
        rules={[{ required: true, message: 'Please input a model of the boat!' }]}
      >
        <Input placeholder='i.e. 212SX' />
      </Form.Item>
      <Form.Item
        name='price'
        rules={[{ required: true, message: 'Please input a price of the boat!' }]}
      >
        <Input placeholder='i.e. 40000' />
      </Form.Item>
      <Form.Item
        name='personId'
        rules={[{ required: true, message: 'Please input a personId of the boat!' }]}
      >
        <Input placeholder='i.e. 1' />
      </Form.Item>

      <Form.Item>
        <Dropdown overlay={menu}>
          <Button>
            {person.firstName} <DownOutlined />
          </Button>
        </Dropdown>
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type='primary'
            htmlType='submit'
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Add Boat
          </Button>
        )}
      </Form.Item>
    </Form>
  )
}

export default AddBoat;
