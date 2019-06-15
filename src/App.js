import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Form, FormGroup, Col, Input, Button } from 'reactstrap'
import './App.css'
const api = "https://spoti-api.herokuapp.com/"
//const api = "http://localhost:8080/"

class App extends Component {

  state = {
    input: "",
    inputPlaceholder: "Accepted format:\n\nhallo : welt | DE \nhello : world | EN\nbonjour : monde | FR",
    amount: "?",
    email: "",
    password: "",
    token: null,
    authenticated: false,
    loginMessage: "Login data:",
    cluster: "user/"
  }

  componentDidMount = async () => {
    const localToken = localStorage.getItem("token")
    const res = await this.getAmount(localToken)
    if (res !== null && res.status === 200) {
      this.setState({ token: localToken, authenticated: true })
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


  sendData = async (token) => {
    const json = this.parser(this.state.input)

    if (json !== null) {
      try {
        json.map(obj => {
          return axios.post(api + this.state.cluster, obj, {
            headers: {
              "authorization": "Bearer " + token
            }
          })
        })
        this.setState({ inputPlaceholder: "Sending was successful.", input: "" })
      } catch (e) {
        this.setState({ inputPlaceholder: "Error occured.", input: "" })
      }
    } else {
      this.setState({ inputPlaceholder: "Invalid input.", input: "" })
    }
  }

  getAmount = async (token) => {
    try {
      const res = await axios.get(api + this.state.cluster + "number", {
        headers: {
          "authorization": "Bearer " + token
        }
      })
      if (res.status === 200) {
        this.setState({
          amount: res.data.Number
        })
      }
      return res
    } catch (e) {
      return null
    }
  }

  login = async () => {
    try {
      const res = await axios.post(api + this.state.cluster + "auth", {
        "email": this.state.email,
        "password": this.state.password
      })
      console.log(res)
      if (res.status === 200) {
        this.setState({
          token: res.data.data.token,
          authenticated: true,
          password: "",
          email: ""
        })
        localStorage.setItem('token', res.data.data.token)
      } else {
        this.setState({ password: "", email: "", loginMessage: "Invalid input." })
        console.log(res)
      }
    } catch (e) {
      this.setState({ password: "", email: "", loginMessage: "Error occured." })
      console.log(e)
    }
  }

  deleteAll = async (token) => {
    try {
      const res = await axios.delete(api + this.state.cluster, {
        headers: {
          "authorization": "Bearer " + token
        }
      })
      await this.getAmount(this.state.token)
    } catch (err) {
      console.log(err)
    }
  }

  selectDB1 = () => {
    this.setState({ cluster: "user/" })
  }

  selectDB2 = () => {
    this.setState({ cluster: "user2/" })
  }

  render() {

    const loginForm = (
      <Form className="App-form">
        <p>{this.state.loginMessage}</p>
        <FormGroup row>
          <Col xl={12} style={{ marginBottom: 10 }}>
            <Input
              style={{ height: 40, width: "100%" }}
              type="text" name="text"
              value={this.state.email}
              placeholder="email"
              id="exampleText"
              onChange={(event) => this.setState({ email: event.target.value })}
            />
          </Col>
          <Col xl={12}>
            <Input style={{ height: 40, width: "100%" }}
              type="password" name="password"
              value={this.state.password}
              placeholder="password"
              id="examplePwd" onChange={(event) => this.setState({ password: event.target.value })}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xl={12}>
            <Button onClick={this.login}>Login</Button>
          </Col>
        </FormGroup>
      </Form>
    )

    const inputForm = (
      <Fragment>
        <Form className="App-form">
          <FormGroup row>
            <Col xl={6}>
              <p>Selected databse:</p>
            </Col>
            <Col xl={3}>
              <Button outline color="secondary" onClick={this.selectDB1} active={this.state.cluster === "user/"}>DB 1</Button>
            </Col>
            <Col xl={3}>
              <Button outline color="secondary" onClick={this.selectDB2} active={this.state.cluster === "user2/"} >DB 2</Button>
            </Col>
          </FormGroup>
        </Form>
        <Form className="App-form">
          <FormGroup row>
            <Col xl={6}>
              <p>Amount of data: {this.state.amount}</p>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xl={6}>
              <Button style={{ marginBottom: "20px" }} onClick={() => this.getAmount(this.state.token)}>Refresh</Button>
            </Col>
            <Col xl={6}>
              <Button color="danger" onClick={() => this.deleteAll(this.state.token)}>Delete all</Button>
            </Col>
          </FormGroup>
          <p>New data:</p>
          <FormGroup row>
            <Col xl={12}>
              <Input style={{ height: 300, width: "100%" }}
                type="textarea" value={this.state.input}
                name="text" placeholder={this.state.inputPlaceholder}
                id="exampleText" onChange={(event) => this.setState({ input: event.target.value })}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xl={12}>
              <Button onClick={() => this.sendData(this.state.token)}>Submit</Button>
            </Col>
          </FormGroup>
        </Form>
      </Fragment >
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
