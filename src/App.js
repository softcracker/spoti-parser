import React, {Component, Fragment} from 'react'
import axios from 'axios'
import {Form, FormGroup, Col, Input, Button} from 'reactstrap'
import './App.css'
const api = "https://spoti-api.herokuapp.com/"

class App extends Component {

  state = {
    input: "",
    inputPlaceholder: "Accepted format:\n\nhallo : welt | DE \nhello : world | EN\nbonjour : monde | FR",
    amount: "?",
    amountPlaceholder: "Amount of data:",
    email: "",
    password: "",
    emailPlaceholder: "email",
    passwordPlaceholder: "password",
    token: null,
    authenticated: false,
    loginMessage: "Login data:"
  }

  componentDidMount = async () => {
    const localToken = localStorage.getItem("token")
    const res = await this.getAmount(localToken)
    if (res.data.status === 200) {
      this.setState({token: localToken, authenticated: true})
    }
  }

  parser = input => {
    try {
      let dataList = []
      const textByLine = input.toString().split("\n")
      textByLine.forEach(line => {
          const splitIndex = line.indexOf('|')
          const string = line.substring(0, splitIndex)
          const splitted = string.split(':')
      
          const obj = {
              "username": splitted[0].trim(),
              "password": splitted[1].trim()
          }
          dataList.push(obj)
      })
      return dataList
    } catch (e) {
      console.log(e)
      return null
    }
  }


  sendData = async () => {
    const json = this.parser(this.state.input)

    if (json !== null) {
      try {
          json.map(obj => {
          return axios.post(api, obj, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": this.state.token
            }
          })
        })
        this.setState({inputPlaceholder: "Sending was successful.", input: ""})
      } catch (e) {
        this.setState({inputPlaceholder: "Error occured.", input: ""})
      }
    } else {
      this.setState({inputPlaceholder: "Invalid input.", input: ""})
    }
  }

  getAmount = async (token) => {
    try {
      const res = await axios.get(api + "number", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": token
        }
      })
      if (res.status === 200) {
        this.setState({
          amount: res.data.Number
        })
      } else {
        this.setState({amountPlaceholder: "Error occured."})
      }
      return res
    } catch (e) {
      this.setState({amountPlaceholder: "Error occured."})
      console.log(e)
      return null
    }
  }

  login = async () => {
    try {
      const res = await axios.get(api + "auth", {
        headers: {
            "email": this.state.email,
            "password": this.state.password
        }
      })
      if (res.status === 200) {
        this.setState({
          token:  res.data.data.token, 
          authenticated: true,
          password: "",
          email: ""
        })
        localStorage.setItem('token', res.data.data.token)
      } else {
        this.setState({password: "", email: "", loginMessage: "Invalid input."})
        console.log(res)
      }
    } catch (e) {
      this.setState({password: "", email: "", loginMessage: "Error occured."})
      console.log(e)
    }
  }

  render() {

    const loginForm = (
        <Form  className="App-form">
          <p>{this.state.loginMessage}</p>
          <FormGroup row>
            <Col xl={12} style={{marginBottom: 10}}>
              <Input
                style={{height: 40, width: "100%" }}
                type="text" name="text"
                value={this.state.email}
                placeholder={this.state.emailPlaceholder}
                id="exampleText"
                onChange={(event) => this.setState({email: event.target.value})}
              />
            </Col>
            <Col xl={12}>
              <Input style={{height: 40, width: "100%" }}
                type="text" name="text"
                value={this.state.password}
                placeholder={this.state.passwordPlaceholder}
                id="exampleText" onChange={(event) => this.setState({password: event.target.value})}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
          <Col  xl={12}>
            <Button onClick={this.login}>Login</Button>
          </Col>
        </FormGroup>
      </Form>
    )

    const inputForm = (
      <Fragment>
        <Form  className="App-form">
          <p>{this.state.amountPlaceholder}</p>
          <FormGroup row>
            <Col xl={12}>
              <p>{this.state.amount}</p>
            </Col>
          </FormGroup>
          <FormGroup row>
          <Col  xl={12}>
            <Button onClick={() => this.getAmount(this.state.token)}>Get amount</Button>
          </Col>
        </FormGroup>
        </Form>
        <Form  className="App-form">
          <p>New data:</p>
          <FormGroup row>
            <Col xl={12}>
              <Input style={{height: 300, width: "100%" }}
                type="textarea" value={this.state.input}
                name="text" placeholder={this.state.inputPlaceholder}
                id="exampleText" onChange={(event) => this.setState({input: event.target.value})}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
          <Col  xl={12}>
            <Button onClick={this.sendData}>Submit</Button>
          </Col>
        </FormGroup>
        </Form>
      </Fragment>
    )

    return (
      <div className="App">
        <header className="App-header">
          {this.state.authenticated ? inputForm : loginForm}
        </header>
      </div>
    ) 
  }
}

export default App 
