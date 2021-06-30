import { useState } from "react";
import { Link, Route, Switch } from 'react-router-dom'

import "./App.css";

let count = 0;

//dummy todo data
const dummyData = [
  { name: "hello", phone: "111-111-1111" },
  { name: "bye", phone: "222-222-2222" },
];

//takes an object and returns jsx list(s) of <li key>key: value</li>
const objDisplay = (obj) => {
  const list = [];

  for (const key in obj) {
    list.push(
      <li key={count++}>
        {key}: {obj[key]}
      </li>
    );
  }

  return list;
};

/* //Todo Component
const Todo = (props) => {
  console.log(props.todo);
  

  const todo = (
    <div>
      <ul>
        {props.todo.map((todo) => {
          return objDisplay(todo);
        })}
      </ul>
    </div>
  );
  console.log(todo);

  return todo; 
  // return <Display data={props.todo} />;
}; */

//formtest
const FormTest = (props) => {
  const sendFormData = (e) => {
    e.preventDefault();
    //send data to server
    console.log(e.target.name.value, e.target.phone.value);
    //display data
  };
  return (
    <form onSubmit={sendFormData}>
        <label htmlFor="name">Name: </label>
        <input type="text" name="name" />
        <label htmlFor="phone">Phone: </label>
        <input type="text" name="phone" />

        <button>Submit</button>
      </form>

  )
}

//invoice
const Invoice = (props) => {
  return (
    <div>Invoice Works!</div>
  )
}

//navigation
const Nav = (props) => {
  return (
    <nav>
      <Link to='/invoice'>To Invoice</Link>
    </nav>
  )
}

//home

const Home = (props) => {
  return (
    <div>Home works!</div>
  )
}

function App() {
  const [dummy, setDummy] = useState([...dummyData]);

  // send data to server once successful, display data through todo component
  

  return (
    <>
      <Nav />

      <Switch>
        <Route path='/invoice'>
          <Invoice />
        </Route>
        <Route path='/form-test'>
          <FormTest />
        </Route>

        <Route>
          <Home />
        </Route>
      </Switch>
      
    </>
  );
}

export default App;