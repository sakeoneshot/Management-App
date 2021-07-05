import { Fragment, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";

import "./App.css";

//Todo Component
const Todo = (props) => {

  // todo list array to display
  const [todoList, setTodoList] = useState([]);
  //user input for new todo
  const [curTodoInput, setCurTodoInput] = useState("");
  //update curTodoInput state with user input
  const onTodoInputChange = (e) => {
    setCurTodoInput(e.target.value);
  };
  //on form submt, add current todo input to todolist arr
  const ontodoFormSubmit = (e) => {
    e.preventDefault();
    //create new todo list array with the new user submitted todo
    const newTodo = [...todoList];

    newTodo.push(curTodoInput);

    setTodoList(newTodo);

    //reset userinput to empty string
    setCurTodoInput('')
  };
  //todo form with an input field for user to type todo and button for submission 
  const todoForm = (
    <form onSubmit={ontodoFormSubmit}>
      <input type="text" value={curTodoInput} onChange={onTodoInputChange} />
      <button>Submit</button>
    </form>
  );

  //when triggered, allow user to update selected todo
  const onEditClick = todo => {
    
    //get selected todo
    //display form with input in the form of 'selected todo' -> 
    //
    return (
      'EditClick Works!'
    )
  }

  //if there is no todo list added, let the user know, otherwise display todo list
  let todoListDisplay = "No todo to display";

  if (todoList.length > 0) {
    todoListDisplay = (
      <ul>
        {todoList.map((todo) => {
          return <li key={Math.random()}>{todo}<button>Edit</button></li>;
        })}
      </ul>
    );
  }

  return (
    <Fragment>
      {todoListDisplay}
      {todoForm}
    </Fragment>
  );
};

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
  );
};

//display invoice received state for each company
const Invoice = (props) => {
  const dummyCompanyList = [
    {
      name: "CompanyA",
      isReceived: false,
    },
    {
      name: "CompanyB",
      isReceived: false,
    },
    {
      name: "CompanyC",
      isReceived: false,
    },
  ];

  const [companiesData, setCompnaiesData] = useState(dummyCompanyList);

  const onCompanyClick = (companyName) => {
    const companyIndex = companiesData.findIndex(
      (company) => company.name === companyName
    );

    const updateCompany = {
      ...companiesData[companyIndex],
      isReceived: !companiesData[companyIndex].isReceived,
    };

    const updateCompanyArr = [...companiesData];

    updateCompanyArr[companyIndex] = updateCompany;

    setCompnaiesData(updateCompanyArr);
  };

  const invoiceText = (company) => {
    if (company.isReceived) {
      return `${company.name} : invoice received`;
    } else {
      return `${company.name} : invoice NOT received yet`;
    }
  };

  return (
    <ul>
      {companiesData.map((company) => {
        return (
          <li
            key={company.name}
            onClick={onCompanyClick.bind(null, company.name)}
          >
            {invoiceText(company)}
          </li>
        );
      })}
    </ul>
  );
};

//navigation
const Nav = (props) => {
  return (
    <nav>
      <Link to="/invoice">To Invoice</Link>
      <Link to="/todo">To Todo</Link>
    </nav>
  );
};

//home

const Home = (props) => {
  return <div>Home works!</div>;
};

//main app component
function App() {
  //const [dummy, setDummy] = useState([...dummyData]);

  // send data to server once successful, display data through todo component

  return (
    <Fragment>
      <Nav />

      <Switch>
        <Route path="/invoice">
          <Invoice />
        </Route>
        <Route path="/form-test">
          <FormTest />
        </Route>
        <Route path="/todo">
          <Todo />
        </Route>

        <Route>
          <Home />
        </Route>
      </Switch>
    </Fragment>
  );
}

export default App;
