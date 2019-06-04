import React, {Component} from 'react'
import axios from 'axios'
import {Form, FormGroup, Col, Input, Button} from 'reactstrap'
import './App.css'
const api = "http://localhost:8080"

class App extends Component {

  state = {
    input: "",
    inputPlaceholder: "Accepted format:\n\nhallo : welt | DE \nhello : world | EN\nbonjour : monde | FR",
    keyword: "",
    keywordPlaceholder: "Example: hello world"
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


  sendData = () => {
    const json = this.parser(this.state.input)

    if (json !== null) {
      json.map(obj => {
        return axios.post(api, obj)
      })
      this.setState({inputPlaceholder: "Sending was successful.", input: ""})
      console.log(json)
    } else {
      this.setState({inputPlaceholder: "Invalid input.", input: ""})
    }
  }

  sendKeyword = () => {
    const keyword = this.state.keyword
    this.setState({keywordPlaceholder: "Sending was successful.", keyword: ""})
    console.log(keyword)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Form  className="App-form">
            <p>Search keyword:</p>
            <FormGroup row>
              <Col xl={12}>
                <Input style={{height: 40, width: "100%" }} type="text" name="text" value={this.state.keyword} placeholder={this.state.keywordPlaceholder} id="exampleText" onChange={(event) => this.setState({keyword: event.target.value})}/>
              </Col>
            </FormGroup>
            <FormGroup row>
            <Col  xl={12}>
              <Button onClick={this.sendKeyword}>Submit</Button>
            </Col>
          </FormGroup>
          </Form>
          <Form  className="App-form">
            <p>New data:</p>
            <FormGroup row>
              <Col xl={12}>
                <Input style={{height: 300, width: "100%" }} type="textarea" value={this.state.input} name="text" placeholder={this.state.inputPlaceholder} id="exampleText" onChange={(event) => this.setState({input: event.target.value})}/>
              </Col>
            </FormGroup>
            <FormGroup row>
            <Col  xl={12}>
              <Button onClick={this.sendData}>Submit</Button>
            </Col>
          </FormGroup>
          </Form>
        </header>
      </div>
    ) 
  }
}

export default App 
