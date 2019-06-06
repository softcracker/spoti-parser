import React, {Component, Fragment} from 'react'
import axios from 'axios'
import {Form, FormGroup, Col, Input, Button} from 'reactstrap'
import './App.css'
const api = "http://localhost:8080/"

class App extends Component {

  state = {
    input: "",
    inputPlaceholder: "Accepted format:\n\nhallo : welt | DE \nhello : world | EN\nbonjour : monde | FR",
    amount: "?",
    amountPlaceholder: "Amount of data:",
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

      try {
          json.map(obj => {
          return axios.post(api, obj)
        })
        this.setState({inputPlaceholder: "Sending was successful.", input: ""})
      } catch (e) {
        this.setState({inputPlaceholder: "Error occured.", input: ""})
      }
  }

  getAmount = async () => {
    try {
      const res = await axios.get(api + "number")
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

  render() {

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
          {inputForm}
        </header>
      </div>
    ) 
  }
}

export default App 
