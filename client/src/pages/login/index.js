import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Alert, Button, Row, Form, Input } from 'antd'
import { config } from 'utils'
import { Link } from 'react-router-dom'
import styles from './index.less'

const FormItem = Form.Item

const Login = ({
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
  },
}) => {
  function handleOk () {
    
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        <Alert message="Error: Password is incorrect" type="error" />
        return
      }
      console.log(values)
      dispatch({ type: 'login/login', payload: values })
    })
  }
  
  function handleNotOk () {
    
    // validateFieldsAndScroll((errors, values) => {
    //   if (errors) {
    //     <Alert message="HHAHAHAA" type="error" />
    //     return
    //   }
    //   console.log(values)
      
    // })
    console.log(getFieldValue('username'))
    //var users =getFieldValue('username')
    //dispatch({ type: 'login/login2', payload:users})
  }
  
  

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img alt="logo" src={config.logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input onChange={handleNotOk} onPressEnter={handleOk} placeholder="Username" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input type="password" onPressEnter={handleOk} placeholder="Password" />)}
        </FormItem>
        
        <Row>
          <Button type="primary" onClick={handleOk} loading={loading.effects.login}>
            Sign in
          </Button>
          <p>
            <span>Username：guest</span>
            <span>Password：guest</span>
          </p>
        </Row>
        <Row>
        <p>Do not have an account? Click register!</p>
          <Button type="default">
          <Link to='/register'>
            Register
          </Link>
          </Button>

         </Row>


      </form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.funct,
  loading: PropTypes.object,
}

export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
