'use strict' 
import React from 'react' 
import 'antd/dist/antd.css' 
import axios from 'axios' 
import { connect } from 'dva'

import { Form, Input, Tooltip, Icon, Select, Row, Col, Checkbox, Button } from 'antd' 


const FormItem = Form.Item 
const Option = Select.Option 


class Register extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  } 

  handleSubmit = (e) => {
    e.preventDefault() 
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values) 
        console.log('Hello, my name is: ', values.name) 
        console.log('I am working in ', values.company) 
        const props = this.props

        axios.post('/signup', {
          username: values.email,
          name : values.name,
          phone: values.phone,
          current_company: values.company,
          division : values.division,
        })
        .then(function (response) {
          alert("Success to insert data to database") 
          console.log("Response is:") 
          console.log(response) 
          props.history.push("/reg")

        })
        .catch(function (error) {
          console.log(error) 
          alert("Error") 
        }) 
      }
    }) 
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value 
    this.setState({ confirmDirty: this.state.confirmDirty || !!value }) 
  }

  compareToFirstEmail = (rule, value, callback) => {
    const form = this.props.form 
    if (value && value !== form.getFieldValue('email')) {
      callback('Two emails that you enter is inconsistent!') 
    } else {
      callback() 
    }
  }

  validateToNextEmail = (rule, value, callback) => {
    const form = this.props.form 
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true }) 
    }
    callback() 
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult 
    if (!value) {
      autoCompleteResult = [] 
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`) 
    }
    this.setState({ autoCompleteResult }) 
  }

  render () {
    const { getFieldDecorator } = this.props.form 
    
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    } 
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    } 
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '62',
    })(
      <Select style={{ width: 70 }}>
        <Option value="62">+62</Option>
        <Option value="63">+63</Option>
        <Option value="64">+64</Option>
        <Option value="65">+65</Option>
      </Select>
    ) 

    

    return (
      <div style={{backgroundColor:"#f5f5f5"}}>
      <Form onSubmit={this.handleSubmit} >
      <h1 style={{textAlign:"center"}}> Registration Form </h1>
      <div style={{textAlign:"center"}}>Create your account. Please fill all fields, the form will be submitted and reviewed by our staff.</div>
      
        <FormItem
          {...formItemLayout}
          label="Name"
        >
        <Row gutter={8}>
            <Col span={18}>
          {getFieldDecorator('name', {
            rules: [ {
              required: true, message: 'Please input your Name!',
            }],
          })(
            <Input />
          )}
          </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Email"
        >
        <Row gutter={8}>
            <Col span={18}>
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid Email!',
            },{
              required: true, message: 'Please input your Email!',
            }, {
              validator: this.validateToNextEmail,
            }],
          })(
            <Input  />
          )}
          </Col></Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Confirm Email"
        >
        <Row gutter={8}>
            <Col span={18}>
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your Email!',
            }, {
              validator: this.compareToFirstEmail,
            }],
          })(
            <Input onBlur={this.handleConfirmBlur} />
          )}
          </Col></Row>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Phone Number"
        >
        <Row gutter={8}>
            <Col span={18}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          )}
          </Col></Row>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={(
            <span>
              Company&nbsp 
              <Tooltip title="Where do you work with the region?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
        <Row gutter={8}>
            <Col span={18}>
          {getFieldDecorator('company', {
            rules: [{ required: true, message: 'Please input your company!', whitespace: true }],
          })(
            <Input />
          )}
          </Col></Row>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={(
            <span>
              Division&nbsp 
              <Tooltip title="What is your current division?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
        <Row gutter={8}>
            <Col span={18}>
          {getFieldDecorator('division', {
            rules: [{ required: true, message: 'Please input your division!', whitespace: true }],
          })(
            <Input />
          )}
          </Col></Row>
        </FormItem>

       
        <FormItem
          {...formItemLayout}
          label="Captcha"
          extra="We must make sure that your are a human."
        >
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: 'Please input the captcha you got!' }],
              })(
                <Input />
              )}
            </Col>
            <Col span={8}>
              <Button>Get captcha</Button>
              
            </Col>
          </Row>

        </FormItem>

        <FormItem {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>I have read the <a href="">agreement</a></Checkbox>
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Register</Button>
        </FormItem>

      </Form>
      </div>
    ) 
  }
}

export default connect(({ loading }) => ({ loading }))(Form.create()(Register))
